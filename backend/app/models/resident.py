from app.extensions import db
from datetime import datetime

class Resident(db.Model):
    __tablename__ = 'residents'

    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(100), nullable=False)
    email        = db.Column(db.String(120), unique=True, nullable=False)
    phone        = db.Column(db.String(20), nullable=False)
    national_id  = db.Column(db.String(50), unique=True, nullable=False)
    room_id      = db.Column(db.Integer, db.ForeignKey('rooms.id'),
                             nullable=True)
    check_in     = db.Column(db.DateTime, nullable=True)
    check_out    = db.Column(db.DateTime, nullable=True)
    is_active    = db.Column(db.Boolean, default=True)
    emergency_contact_name  = db.Column(db.String(100), nullable=True)
    emergency_contact_phone = db.Column(db.String(20), nullable=True)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at   = db.Column(db.DateTime, default=datetime.utcnow,
                             onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id':          self.id,
            'name':        self.name,
            'email':       self.email,
            'phone':       self.phone,
            'national_id': self.national_id,
            'room_id':     self.room_id,
            'room_number': self.room.room_number if self.room else None,
            'check_in':    self.check_in.isoformat() if self.check_in else None,
            'check_out':   self.check_out.isoformat() if self.check_out else None,
            'is_active':   self.is_active,
            'emergency_contact_name':  self.emergency_contact_name,
            'emergency_contact_phone': self.emergency_contact_phone,
            'created_at':  self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<Resident {self.name} | Room {self.room_id}>'