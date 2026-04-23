from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.user import User
from app.utils import success_response, error_response, paginated_response
from app.utils.validators import (validate_email, validate_required_fields,
                                   validate_role)
from app.middleware.rbac import admin_required
from app.middleware.audit_middleware import log_action

users_bp = Blueprint('users', __name__)


@users_bp.route('/', methods=['GET'])
@admin_required
def get_all_users():
    page     = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    role     = request.args.get('role')
    search   = request.args.get('search')

    query = User.query

    if role:
        query = query.filter_by(role=role)
    if search:
        query = query.filter(User.name.ilike(f'%{search}%') |
                             User.email.ilike(f'%{search}%'))

    total   = query.count()
    users   = query.offset((page - 1) * per_page).limit(per_page).all()

    return paginated_response(
        message  = "Users fetched",
        items    = [u.to_dict() for u in users],
        total    = total,
        page     = page,
        per_page = per_page
    )


@users_bp.route('/<int:user_id>', methods=['GET'])
@admin_required
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", status_code=404)
    return success_response("User fetched", data=user.to_dict())


@users_bp.route('/', methods=['POST'])
@admin_required
def create_user():
    data = request.get_json()

    missing = validate_required_fields(data, ['name', 'email',
                                               'password', 'role'])
    if missing:
        return error_response("Missing fields",
                              errors={'missing': missing}, status_code=422)

    if not validate_email(data['email']):
        return error_response("Invalid email format", status_code=400)

    if not validate_role(data['role']):
        return error_response("Role must be admin, manager or staff",
                              status_code=400)

    if User.query.filter_by(email=data['email']).first():
        return error_response("Email already exists", status_code=409)

    if len(data['password']) < 6:
        return error_response("Password must be at least 6 characters",
                              status_code=400)

    user = User(
        name  = data['name'].strip(),
        email = data['email'].strip().lower(),
        role  = data['role']
    )
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    log_action(
        action      = 'CREATE_USER',
        entity_type = 'user',
        entity_id   = user.id,
        description = f'User {user.email} created with role {user.role}'
    )

    return success_response("User created", data=user.to_dict(),
                            status_code=201)


@users_bp.route('/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", status_code=404)

    data = request.get_json()

    if 'name' in data:
        user.name = data['name'].strip()

    if 'email' in data:
        if not validate_email(data['email']):
            return error_response("Invalid email format", status_code=400)
        existing = User.query.filter_by(email=data['email']).first()
        if existing and existing.id != user_id:
            return error_response("Email already in use", status_code=409)
        user.email = data['email'].strip().lower()

    if 'role' in data:
        if not validate_role(data['role']):
            return error_response("Invalid role", status_code=400)
        user.role = data['role']

    if 'is_active' in data:
        user.is_active = bool(data['is_active'])

    db.session.commit()

    log_action(
        action      = 'UPDATE_USER',
        entity_type = 'user',
        entity_id   = user.id,
        description = f'User {user.email} updated'
    )

    return success_response("User updated", data=user.to_dict())


@users_bp.route('/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", status_code=404)

    email = user.email
    db.session.delete(user)
    db.session.commit()

    log_action(
        action      = 'DELETE_USER',
        entity_type = 'user',
        entity_id   = user_id,
        description = f'User {email} deleted'
    )

    return success_response("User deleted")