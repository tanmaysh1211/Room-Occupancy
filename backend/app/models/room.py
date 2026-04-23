from app.extensions import db
from datetime import datetime

class Room(db.Model):
    __tablename__ = 'rooms'

    id           = db.Column(db.Integer, primary_key=True)
    room_number  = db.Column(db.String(10), unique=True, nullable=False)
    floor        = db.Column(db.Integer, nullable=False)
    room_type    = db.Column(db.Enum('single', 'double', 'suite'),
                             nullable=False, default='single')
    status       = db.Column(db.Enum('available', 'occupied', 'maintenance'),
                             nullable=False, default='available')
    capacity     = db.Column(db.Integer, nullable=False, default=1)
    monthly_rent = db.Column(db.Float, nullable=False, default=0.0)
    description  = db.Column(db.Text, nullable=True)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at   = db.Column(db.DateTime, default=datetime.utcnow,
                             onupdate=datetime.utcnow)

    # Relationship
    residents = db.relationship('Resident', backref='room', lazy=True)

    # def to_dict(self):
    #     return {
    #         'id':           self.id,
    #         'room_number':  self.room_number,
    #         'floor':        self.floor,
    #         'room_type':    self.room_type,
    #         'status':       self.status,
    #         'capacity':     self.capacity,
    #         'monthly_rent': self.monthly_rent,
    #         'description':  self.description,
    #         # 'created_at':   self.created_at.isoformat(),
    #         "created_at": self.created_at.isoformat() if self.created_at else None,
    #         'resident_count': len(self.residents)
    #     }

    def to_dict(self):
        return {
            'id':           self.id,
            'room_number':  self.room_number,
            'floor':        self.floor,
            'room_type':    self.room_type,
            'status':       self.status,
            'capacity':     self.capacity,
            'monthly_rent': float(self.monthly_rent) if self.monthly_rent else 0.0,
            'description':  self.description,
            'created_at':   self.created_at.isoformat(),
            'resident_count': len(self.residents)
        }

    def __repr__(self):
        return f'<Room {self.room_number} | {self.status}>'