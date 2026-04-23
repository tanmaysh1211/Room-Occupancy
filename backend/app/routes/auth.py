from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from app.extensions import db
from app.models.user import User
from app.utils import success_response, error_response
from app.middleware.audit_middleware import log_action

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return error_response("Email and password required", status_code=400)

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return error_response("Invalid email or password", status_code=401)

    if not user.is_active:
        return error_response("Account is deactivated", status_code=403)

    # Add role + email to JWT claims
    additional_claims = {
        'role':  user.role,
        'email': user.email,
        'name':  user.name
    }

    access_token  = create_access_token(
        identity=str(user.id),
        additional_claims=additional_claims
    )
    refresh_token = create_refresh_token(
        identity=str(user.id),
        additional_claims=additional_claims
    )

    log_action(
        action      = 'LOGIN',
        entity_type = 'user',
        entity_id   = user.id,
        description = f'{user.email} logged in'
    )

    return success_response("Login successful", data={
        'access_token':  access_token,
        'refresh_token': refresh_token,
        'user':          user.to_dict()
    })


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    claims   = get_jwt()

    additional_claims = {
        'role':  claims.get('role'),
        'email': claims.get('email'),
        'name':  claims.get('name')
    }

    new_access_token = create_access_token(
        identity=identity,
        additional_claims=additional_claims
    )

    return success_response("Token refreshed", data={
        'access_token': new_access_token
    })


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    identity = get_jwt_identity()
    claims   = get_jwt()

    log_action(
        action      = 'LOGOUT',
        entity_type = 'user',
        entity_id   = identity,
        description = f'{claims.get("email")} logged out'
    )

    return success_response("Logged out successfully")


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user     = User.query.get(identity)

    if not user:
        return error_response("User not found", status_code=404)

    return success_response("User fetched", data=user.to_dict())


@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    identity = get_jwt_identity()
    data     = request.get_json()
    user     = User.query.get(identity)

    if not data.get('old_password') or not data.get('new_password'):
        return error_response("Old and new password required", status_code=400)

    if not user.check_password(data['old_password']):
        return error_response("Old password is incorrect", status_code=401)

    if len(data['new_password']) < 6:
        return error_response("Password must be at least 6 characters", status_code=400)

    user.set_password(data['new_password'])
    db.session.commit()

    log_action(
        action      = 'CHANGE_PASSWORD',
        entity_type = 'user',
        entity_id   = user.id,
        description = f'{user.email} changed their password'
    )

    return success_response("Password changed successfully")