from flask import Flask
from app.config import config
from app.extensions import db, migrate, jwt, bcrypt, cors
from flask_cors import CORS 

def create_app(config_name='default'):
    app = Flask(__name__)

    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

    # Load config
    app.config.from_object(config[config_name])

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {"origins": app.config['CORS_ORIGINS']}
    })

     # 🔴 ADD THIS BLOCK (VERY IMPORTANT)
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print("❌ INVALID TOKEN:", error)
        return {"success": False, "message": "Invalid token"}, 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print("❌ MISSING TOKEN:", error)
        return {"success": False, "message": "Missing token"}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print("❌ EXPIRED TOKEN")
        return {"success": False, "message": "Token expired"}, 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        print("❌ REVOKED TOKEN")
        return {"success": False, "message": "Token revoked"}, 401

    @jwt.needs_fresh_token_loader
    def fresh_token_required_callback(jwt_header, jwt_payload):
        print("❌ FRESH TOKEN REQUIRED")
        return {"success": False, "message": "Fresh token required"}, 401
    # 🔴 END BLOCK

    # Register blueprints
    from app.routes.auth      import auth_bp
    from app.routes.users     import users_bp
    from app.routes.rooms     import rooms_bp
    from app.routes.residents import residents_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.audit     import audit_bp

    app.register_blueprint(auth_bp,      url_prefix='/api/auth')
    app.register_blueprint(users_bp,     url_prefix='/api/users')
    app.register_blueprint(rooms_bp,     url_prefix='/api/rooms')
    app.register_blueprint(residents_bp, url_prefix='/api/residents')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(audit_bp,     url_prefix='/api/audit')

    # Import models so Flask-Migrate can detect them
    from app.models import User, Room, Resident, AuditLog

    # Health check route
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'RoomOccupancy API running'}, 200

    return app