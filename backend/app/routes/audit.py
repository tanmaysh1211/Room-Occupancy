from flask import Blueprint, request
from app.models.audit_log import AuditLog
from app.utils import success_response, paginated_response
from app.middleware.rbac import admin_required

audit_bp = Blueprint('audit', __name__)


@audit_bp.route('/', methods=['GET'])
@admin_required
def get_audit_logs():
    page        = request.args.get('page', 1, type=int)
    per_page    = request.args.get('per_page', 20, type=int)
    action      = request.args.get('action')
    entity_type = request.args.get('entity_type')
    user_email  = request.args.get('user_email')

    query = AuditLog.query

    if action:
        query = query.filter(AuditLog.action.ilike(f'%{action}%'))
    if entity_type:
        query = query.filter_by(entity_type=entity_type)
    if user_email:
        query = query.filter(AuditLog.user_email.ilike(f'%{user_email}%'))

    query = query.order_by(AuditLog.timestamp.desc())
    total = query.count()
    logs  = query.offset((page - 1) * per_page).limit(per_page).all()

    return paginated_response(
        message  = "Audit logs fetched",
        items    = [l.to_dict() for l in logs],
        total    = total,
        page     = page,
        per_page = per_page
    )


@audit_bp.route('/summary', methods=['GET'])
@admin_required
def get_audit_summary():
    from sqlalchemy import func
    from app.extensions import db

    action_counts = db.session.query(
        AuditLog.action,
        func.count(AuditLog.id).label('count')
    ).group_by(AuditLog.action).order_by(
        func.count(AuditLog.id).desc()
    ).all()

    user_activity = db.session.query(
        AuditLog.user_email,
        func.count(AuditLog.id).label('count')
    ).filter(AuditLog.user_email.isnot(None)
    ).group_by(AuditLog.user_email).order_by(
        func.count(AuditLog.id).desc()
    ).limit(10).all()

    return success_response("Audit summary fetched", data={
        'action_counts': [
            {'action': a.action, 'count': a.count}
            for a in action_counts
        ],
        'top_users': [
            {'email': u.user_email, 'count': u.count}
            for u in user_activity
        ]
    })