# from flask import Blueprint
# from app.extensions import db
# from app.models.room import Room
# from app.models.resident import Resident
# from app.models.audit_log import AuditLog
# from app.models.user import User
# from app.utils import success_response
# from app.middleware.rbac import staff_required
# from sqlalchemy import func

# dashboard_bp = Blueprint('dashboard', __name__)


# @dashboard_bp.route('/', methods=['GET'])
# @staff_required
# def get_dashboard():

#     # Room stats
#     total_rooms       = Room.query.count()
#     available_rooms   = Room.query.filter_by(status='available').count()
#     occupied_rooms    = Room.query.filter_by(status='occupied').count()
#     maintenance_rooms = Room.query.filter_by(status='maintenance').count()
#     occupancy_rate    = round((occupied_rooms / total_rooms * 100)
#                                if total_rooms > 0 else 0, 2)

#     # Resident stats
#     total_residents  = Resident.query.count()
#     active_residents = Resident.query.filter_by(is_active=True).count()

#     # Revenue stats
#     total_revenue = db.session.query(
#         func.sum(Room.monthly_rent)
#     ).join(Resident, Resident.room_id == Room.id
#     ).filter(Resident.is_active == True).scalar() or 0

#     # Room type breakdown
#     room_type_stats = db.session.query(
#         Room.room_type,
#         func.count(Room.id).label('total'),
#         func.sum(
#             db.case((Room.status == 'occupied', 1), else_=0)
#         ).label('occupied')
#     ).group_by(Room.room_type).all()

#     # Floor wise occupancy
#     floor_stats = db.session.query(
#         Room.floor,
#         func.count(Room.id).label('total_rooms'),
#         func.sum(
#             db.case((Room.status == 'occupied', 1), else_=0)
#         ).label('occupied_rooms')
#     ).group_by(Room.floor).order_by(Room.floor).all()

#     # Recent audit logs (last 10)
#     recent_logs = AuditLog.query.order_by(
#         AuditLog.timestamp.desc()
#     ).limit(10).all()

#     # Total users
#     total_users = User.query.count()

#     return success_response("Dashboard fetched", data={
#         'rooms': {
#             'total':       total_rooms,
#             'available':   available_rooms,
#             'occupied':    occupied_rooms,
#             'maintenance': maintenance_rooms,
#             'occupancy_rate': occupancy_rate
#         },
#         'residents': {
#             'total':  total_residents,
#             'active': active_residents
#         },
#         'revenue': {
#             'monthly_total': round(float(total_revenue), 2)
#         },
#         'room_type_breakdown': [
#             {
#                 'type':     r.room_type,
#                 'total':    r.total,
#                 'occupied': r.occupied or 0
#             }
#             for r in room_type_stats
#         ],
#         'floor_stats': [
#             {
#                 'floor':          f.floor,
#                 'total_rooms':    f.total_rooms,
#                 'occupied_rooms': f.occupied_rooms or 0
#             }
#             for f in floor_stats
#         ],
#         'recent_activity': [l.to_dict() for l in recent_logs],
#         'total_users':     total_users
#     })







from flask import Blueprint, request, current_app
from app.extensions import db
from app.models.room import Room
from app.models.resident import Resident
from app.models.audit_log import AuditLog
from app.models.user import User
from app.utils import success_response
from app.middleware.rbac import staff_required
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/', methods=['GET'])
@staff_required
def get_dashboard():

    # 🔴 DEBUG START (temporary)
    print("========== DEBUG DASHBOARD ==========")
    print("AUTH HEADER:", request.headers.get('Authorization'))
    print("JWT KEY LENGTH:", len(current_app.config['JWT_SECRET_KEY']))
    print("====================================")
    # 🔴 DEBUG END

    # Room stats
    total_rooms       = Room.query.count()
    available_rooms   = Room.query.filter_by(status='available').count()
    occupied_rooms    = Room.query.filter_by(status='occupied').count()
    maintenance_rooms = Room.query.filter_by(status='maintenance').count()
    occupancy_rate    = round((occupied_rooms / total_rooms * 100)
                               if total_rooms > 0 else 0, 2)

    # Resident stats
    total_residents  = Resident.query.count()
    active_residents = Resident.query.filter_by(is_active=True).count()

    # Revenue stats
    total_revenue = db.session.query(
        func.sum(Room.monthly_rent)
    ).join(Resident, Resident.room_id == Room.id
    ).filter(Resident.is_active == True).scalar() or 0

    # Room type breakdown
    room_type_stats = db.session.query(
        Room.room_type,
        func.count(Room.id).label('total'),
        func.sum(
            db.case((Room.status == 'occupied', 1), else_=0)
        ).label('occupied')
    ).group_by(Room.room_type).all()

    # Floor wise occupancy
    floor_stats = db.session.query(
        Room.floor,
        func.count(Room.id).label('total_rooms'),
        func.sum(
            db.case((Room.status == 'occupied', 1), else_=0)
        ).label('occupied_rooms')
    ).group_by(Room.floor).order_by(Room.floor).all()

    # Recent audit logs
    recent_logs = AuditLog.query.order_by(
        AuditLog.timestamp.desc()
    ).limit(10).all()

    total_users = User.query.count()

    return success_response("Dashboard fetched", data={
        'rooms': {
            'total': total_rooms,
            'available': available_rooms,
            'occupied': occupied_rooms,
            'maintenance': maintenance_rooms,
            'occupancy_rate': occupancy_rate
        },
        'residents': {
            'total': total_residents,
            'active': active_residents
        },
        'revenue': {
            'monthly_total': round(float(total_revenue), 2)
        },
        'room_type_breakdown': [
            {
                'type': r.room_type,
                'total': r.total,
                'occupied': r.occupied or 0
            } for r in room_type_stats
        ],
        'floor_stats': [
            {
                'floor': f.floor,
                'total_rooms': f.total_rooms,
                'occupied_rooms': f.occupied_rooms or 0
            } for f in floor_stats
        ],
        'recent_activity': [l.to_dict() for l in recent_logs],
        'total_users': total_users
    })