from flask import Blueprint, request
from datetime import datetime
from app.extensions import db
from app.models.resident import Resident
from app.models.room import Room
from app.utils import success_response, error_response, paginated_response
from app.utils.validators import (validate_required_fields, validate_email,
                                   validate_phone)
from app.middleware.rbac import staff_required, manager_or_admin_required
from app.middleware.audit_middleware import log_action

residents_bp = Blueprint('residents', __name__)


@residents_bp.route('/', methods=['GET'])
@staff_required
def get_all_residents():
    page      = request.args.get('page', 1, type=int)
    per_page  = request.args.get('per_page', 10, type=int)
    is_active = request.args.get('is_active', type=int)
    room_id   = request.args.get('room_id', type=int)
    search    = request.args.get('search')

    query = Resident.query

    if is_active is not None:
        query = query.filter_by(is_active=bool(is_active))
    if room_id:
        query = query.filter_by(room_id=room_id)
    if search:
        query = query.filter(
            Resident.name.ilike(f'%{search}%') |
            Resident.email.ilike(f'%{search}%') |
            Resident.phone.ilike(f'%{search}%')
        )

    total     = query.count()
    residents = query.offset((page - 1) * per_page).limit(per_page).all()

    return paginated_response(
        message  = "Residents fetched",
        items    = [r.to_dict() for r in residents],
        total    = total,
        page     = page,
        per_page = per_page
    )


@residents_bp.route('/<int:resident_id>', methods=['GET'])
@staff_required
def get_resident(resident_id):
    resident = Resident.query.get(resident_id)
    if not resident:
        return error_response("Resident not found", status_code=404)
    return success_response("Resident fetched", data=resident.to_dict())


@residents_bp.route('/', methods=['POST'])
@manager_or_admin_required
def create_resident():
    data = request.get_json()

    missing = validate_required_fields(data, ['name', 'email',
                                               'phone', 'national_id'])
    if missing:
        return error_response("Missing fields",
                              errors={'missing': missing}, status_code=422)

    if not validate_email(data['email']):
        return error_response("Invalid email format", status_code=400)

    if not validate_phone(data['phone']):
        return error_response("Invalid phone number", status_code=400)

    if Resident.query.filter_by(email=data['email']).first():
        return error_response("Email already exists", status_code=409)

    if Resident.query.filter_by(national_id=data['national_id']).first():
        return error_response("National ID already exists", status_code=409)

    resident = Resident(
        name                    = data['name'].strip(),
        email                   = data['email'].strip().lower(),
        phone                   = data['phone'].strip(),
        national_id             = data['national_id'].strip(),
        emergency_contact_name  = data.get('emergency_contact_name', ''),
        emergency_contact_phone = data.get('emergency_contact_phone', '')
    )

    db.session.add(resident)
    db.session.commit()

    log_action(
        action      = 'CREATE_RESIDENT',
        entity_type = 'resident',
        entity_id   = resident.id,
        description = f'Resident {resident.name} created'
    )

    return success_response("Resident created", data=resident.to_dict(),
                            status_code=201)


@residents_bp.route('/<int:resident_id>', methods=['PUT'])
@manager_or_admin_required
def update_resident(resident_id):
    resident = Resident.query.get(resident_id)
    if not resident:
        return error_response("Resident not found", status_code=404)

    data = request.get_json()

    if 'name'        in data: resident.name        = data['name'].strip()
    if 'phone'       in data: resident.phone       = data['phone'].strip()
    if 'national_id' in data: resident.national_id = data['national_id'].strip()
    if 'emergency_contact_name'  in data:
        resident.emergency_contact_name  = data['emergency_contact_name']
    if 'emergency_contact_phone' in data:
        resident.emergency_contact_phone = data['emergency_contact_phone']

    if 'email' in data:
        if not validate_email(data['email']):
            return error_response("Invalid email format", status_code=400)
        existing = Resident.query.filter_by(email=data['email']).first()
        if existing and existing.id != resident_id:
            return error_response("Email already in use", status_code=409)
        resident.email = data['email'].strip().lower()

    db.session.commit()

    log_action(
        action      = 'UPDATE_RESIDENT',
        entity_type = 'resident',
        entity_id   = resident.id,
        description = f'Resident {resident.name} updated'
    )

    return success_response("Resident updated", data=resident.to_dict())


@residents_bp.route('/<int:resident_id>/assign-room', methods=['PATCH'])
@manager_or_admin_required
def assign_room(resident_id):
    resident = Resident.query.get(resident_id)
    if not resident:
        return error_response("Resident not found", status_code=404)

    data    = request.get_json()
    room_id = data.get('room_id')

    if not room_id:
        return error_response("room_id is required", status_code=400)

    room = Room.query.get(room_id)
    if not room:
        return error_response("Room not found", status_code=404)

    if room.status != 'available':
        return error_response(
            f"Room {room.room_number} is not available",
            status_code=400
        )

    current_occupants = Resident.query.filter_by(
        room_id=room_id, is_active=True).count()

    if current_occupants >= room.capacity:
        return error_response(
            f"Room {room.room_number} is at full capacity",
            status_code=400
        )

    resident.room_id   = room_id
    resident.check_in  = datetime.utcnow()
    resident.is_active = True

    if current_occupants + 1 >= room.capacity:
        room.status = 'occupied'

    db.session.commit()

    log_action(
        action      = 'ASSIGN_ROOM',
        entity_type = 'resident',
        entity_id   = resident.id,
        description = f'Resident {resident.name} assigned to room {room.room_number}'
    )

    return success_response("Room assigned successfully",
                            data=resident.to_dict())


@residents_bp.route('/<int:resident_id>/checkout', methods=['PATCH'])
@manager_or_admin_required
def checkout_resident(resident_id):
    resident = Resident.query.get(resident_id)
    if not resident:
        return error_response("Resident not found", status_code=404)

    if not resident.room_id:
        return error_response("Resident is not assigned to any room",
                              status_code=400)

    room               = resident.room
    resident.check_out = datetime.utcnow()
    resident.is_active = False
    old_room_number    = room.room_number
    resident.room_id   = None
    room.status        = 'available'

    db.session.commit()

    log_action(
        action      = 'CHECKOUT_RESIDENT',
        entity_type = 'resident',
        entity_id   = resident.id,
        description = f'Resident {resident.name} checked out from room {old_room_number}'
    )

    return success_response("Resident checked out", data=resident.to_dict())


@residents_bp.route('/<int:resident_id>', methods=['DELETE'])
@manager_or_admin_required
def delete_resident(resident_id):
    resident = Resident.query.get(resident_id)
    if not resident:
        return error_response("Resident not found", status_code=404)

    if resident.room_id:
        return error_response(
            "Checkout resident before deleting",
            status_code=400
        )

    name = resident.name
    db.session.delete(resident)
    db.session.commit()

    log_action(
        action      = 'DELETE_RESIDENT',
        entity_type = 'resident',
        entity_id   = resident_id,
        description = f'Resident {name} deleted'
    )

    return success_response("Resident deleted")