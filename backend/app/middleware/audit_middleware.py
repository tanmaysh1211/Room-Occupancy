from flask import request
from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request
from app.extensions import db
from app.models.audit_log import AuditLog


def log_action(action, entity_type, entity_id=None, description=None):
    """
    Call this inside any route to log an action.

    Usage:
        log_action(
            action      = 'CREATE_ROOM',
            entity_type = 'room',
            entity_id   = room.id,
            description = f'Room {room.room_number} created'
        )
    """
    try:
        # Try to get JWT claims if user is logged in
        verify_jwt_in_request(optional=True)
        claims   = get_jwt()
        identity = get_jwt_identity()

        user_id    = identity if identity else None
        user_email = claims.get('email') if claims else None
        user_role  = claims.get('role')  if claims else None

    except Exception:
        user_id    = None
        user_email = None
        user_role  = None

    # Get client IP address
    ip_address = request.headers.get('X-Forwarded-For',
                                      request.remote_addr)

    # Create immutable log entry
    log = AuditLog(
        user_id     = user_id,
        user_email  = user_email,
        user_role   = user_role,
        action      = action,
        entity_type = entity_type,
        entity_id   = entity_id,
        description = description,
        ip_address  = ip_address
    )

    db.session.add(log)
    db.session.commit()