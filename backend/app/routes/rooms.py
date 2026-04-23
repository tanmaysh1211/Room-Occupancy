from flask import Blueprint, request
from flask import jsonify
from app.extensions import db
from app.models.room import Room
from app.utils import success_response, error_response, paginated_response
from app.utils.validators import (validate_required_fields, validate_room_number,
                                   validate_rent, validate_floor,
                                   validate_capacity, validate_room_type,
                                   validate_room_status)
from app.middleware.rbac import staff_required, manager_or_admin_required
from app.middleware.audit_middleware import log_action

rooms_bp = Blueprint('rooms', __name__)


@rooms_bp.route('/', methods=['GET'])
@staff_required
def get_all_rooms():
    page     = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status   = request.args.get('status')
    floor    = request.args.get('floor', type=int)
    search   = request.args.get('search')

    query = Room.query

    if status:
        query = query.filter_by(status=status)
    if floor:
        query = query.filter_by(floor=floor)
    if search:
        query = query.filter(Room.room_number.ilike(f'%{search}%'))

    total = query.count()
    rooms = query.offset((page - 1) * per_page).limit(per_page).all()

    return paginated_response(
        message  = "Rooms fetched",
        items    = [r.to_dict() for r in rooms],
        total    = total,
        page     = page,
        per_page = per_page
    )


@rooms_bp.route('/<int:room_id>', methods=['GET'])
@staff_required
def get_room(room_id):
    room = Room.query.get(room_id)
    if not room:
        return error_response("Room not found", status_code=404)
    return success_response("Room fetched", data=room.to_dict())


@rooms_bp.route('/', methods=['POST'])
@manager_or_admin_required
def create_room():
    data = request.get_json()

    missing = validate_required_fields(data, ['room_number', 'floor',
                                               'room_type', 'monthly_rent'])
    if missing:
        return error_response("Missing fields",
                              errors={'missing': missing}, status_code=422)

    if not validate_room_number(data['room_number']):
        return error_response("Invalid room number format", status_code=400)

    if not validate_floor(data['floor']):
        return error_response("Invalid floor number", status_code=400)

    if not validate_room_type(data['room_type']):
        return error_response("Room type must be single, double or suite",
                              status_code=400)

    if not validate_rent(data['monthly_rent']):
        return error_response("Rent must be a positive number", status_code=400)

    # if Room.query.filter_by(room_number=data['room_number']).first():
    #     return error_response("Room number already exists", status_code=409)

    room_number = data['room_number'].strip().upper()

    if Room.query.filter_by(room_number=room_number).first():
        return error_response("Room number already exists", status_code=409)

    room = Room(
        room_number  = data['room_number'].strip().upper(),
        floor        = int(data['floor']),
        room_type    = data['room_type'],
        monthly_rent = float(data['monthly_rent']),
        capacity     = int(data.get('capacity', 1)),
        description  = data.get('description', ''),
        status       = 'available'
    )

    db.session.add(room)
    # db.session.commit()

    # log_action(
    #     action      = 'CREATE_ROOM',
    #     entity_type = 'room',
    #     entity_id   = room.id,
    #     description = f'Room {room.room_number} created on floor {room.floor}'
    # )


    db.session.commit()

    try:
        log_action(
        action='CREATE_ROOM',
        entity_type='room',
        entity_id=room.id,
        description=f'Room {room.room_number} created on floor {room.floor}'
    )
    except Exception as e:
        print("LOG ERROR (CREATE):", e)

    # return success_response("Room created", data=room.to_dict(),
    #                         status_code=201)

    print("ROOM CREATED:", room.id)
    
    return jsonify({
    "success": True,
    "data": {
        "id": room.id,
        "room_number": room.room_number,
        "floor": room.floor,
        "room_type": room.room_type,
        "status": room.status,
        "capacity": room.capacity,
        "monthly_rent": float(room.monthly_rent),
        "description": room.description
    }
}), 201

@rooms_bp.route('/<int:room_id>', methods=['PUT'])
@manager_or_admin_required
def update_room(room_id):
    room = Room.query.get(room_id)
    if not room:
        return error_response("Room not found", status_code=404)

    data = request.get_json()

    if 'room_number' in data:
        if not validate_room_number(data['room_number']):
            return error_response("Invalid room number", status_code=400)
        existing = Room.query.filter_by(
            room_number=data['room_number']).first()
        if existing and existing.id != room_id:
            return error_response("Room number already in use", status_code=409)
        room.room_number = data['room_number'].strip().upper()

    if 'floor'        in data: room.floor        = int(data['floor'])
    if 'room_type'    in data: room.room_type    = data['room_type']
    if 'monthly_rent' in data: room.monthly_rent = float(data['monthly_rent'])
    if 'capacity'     in data: room.capacity     = int(data['capacity'])
    if 'description'  in data: room.description  = data['description']

    if 'status' in data:
        if not validate_room_status(data['status']):
            return error_response("Invalid status", status_code=400)
        room.status = data['status']

    # db.session.commit()

    # log_action(
    #     action      = 'UPDATE_ROOM',
    #     entity_type = 'room',
    #     entity_id   = room.id,
    #     description = f'Room {room.room_number} updated'
    # )


    db.session.commit()

    try:
        log_action(
        action='UPDATE_ROOM',
        entity_type='room',
        entity_id=room.id,
        description=f'Room {room.room_number} updated'
    )
    except Exception as e:
        print("LOG ERROR (UPDATE):", e)

    return success_response("Room updated", data=room.to_dict())


@rooms_bp.route('/<int:room_id>', methods=['DELETE'])
@manager_or_admin_required
def delete_room(room_id):
    room = Room.query.get(room_id)
    if not room:
        return error_response("Room not found", status_code=404)

    if room.residents:
        return error_response(
            "Cannot delete room with active residents",
            status_code=400
        )

    room_number = room.room_number
    db.session.delete(room)
    # db.session.commit()

    # log_action(
    #     action      = 'DELETE_ROOM',
    #     entity_type = 'room',
    #     entity_id   = room_id,
    #     description = f'Room {room_number} deleted'
    # )


    db.session.commit()

    try:
        log_action(
        action='DELETE_ROOM',
        entity_type='room',
        entity_id=room_id,
        description=f'Room {room_number} deleted'
    )
    except Exception as e:
        print("LOG ERROR (DELETE):", e)

    return success_response("Room deleted")


@rooms_bp.route('/<int:room_id>/status', methods=['PATCH'])
@manager_or_admin_required
def update_room_status(room_id):
    room = Room.query.get(room_id)
    if not room:
        return error_response("Room not found", status_code=404)

    data = request.get_json()
    if not validate_room_status(data.get('status', '')):
        return error_response("Invalid status", status_code=400)

    old_status  = room.status
    room.status = data['status']
    # db.session.commit()

    # log_action(
    #     action      = 'UPDATE_ROOM_STATUS',
    #     entity_type = 'room',
    #     entity_id   = room.id,
    #     description = f'Room {room.room_number} status changed from {old_status} to {room.status}'
    # )

    db.session.commit()

    try:
        log_action(
        action='UPDATE_ROOM_STATUS',
        entity_type='room',
        entity_id=room.id,
        description=f'Room {room.room_number} status changed from {old_status} to {room.status}'
    )
    except Exception as e:
        print("LOG ERROR (STATUS):", e)

    return success_response("Room status updated", data=room.to_dict())