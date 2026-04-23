from app.extensions import db
from datetime import datetime

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    # Immutable — no update allowed, insert only
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'),
                            nullable=True)
    user_email  = db.Column(db.String(120), nullable=True)
    user_role   = db.Column(db.String(20), nullable=True)
    action      = db.Column(db.String(50), nullable=False)
    # e.g. CREATE_ROOM, UPDATE_RESIDENT, DELETE_USER
    entity_type = db.Column(db.String(50), nullable=False)
    # e.g. room, resident, user
    entity_id   = db.Column(db.Integer, nullable=True)
    description = db.Column(db.Text, nullable=True)
    ip_address  = db.Column(db.String(50), nullable=True)
    timestamp   = db.Column(db.DateTime, default=datetime.utcnow,
                            nullable=False)

    # Relationship
    user = db.relationship('User', backref='audit_logs', lazy=True)

    def to_dict(self):
        return {
            'id':          self.id,
            'user_id':     self.user_id,
            'user_email':  self.user_email,
            'user_role':   self.user_role,
            'action':      self.action,
            'entity_type': self.entity_type,
            'entity_id':   self.entity_id,
            'description': self.description,
            'ip_address':  self.ip_address,
            'timestamp':   self.timestamp.isoformat()
        }

    def __repr__(self):
        return f'<AuditLog {self.action} on {self.entity_type} by {self.user_email}>'