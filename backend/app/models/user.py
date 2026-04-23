# from app.extensions import db
# from werkzeug.security import generate_password_hash, check_password_hash
# from datetime import datetime

# class User(db.Model):
#     __tablename__ = 'users'

#     id         = db.Column(db.Integer, primary_key=True)
#     name       = db.Column(db.String(100), nullable=False)
#     email      = db.Column(db.String(120), unique=True, nullable=False)
#     password   = db.Column(db.String(255), nullable=False)
#     role       = db.Column(db.Enum('admin', 'manager', 'staff'),
#                            nullable=False, default='staff')
#     is_active  = db.Column(db.Boolean, default=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow,
#                            onupdate=datetime.utcnow)

#     # def set_password(self, password):
#     #     self.password = bcrypt.generate_password_hash(password).decode('utf-8')

#     # def check_password(self, password):
#     #     return bcrypt.check_password_hash(self.password, password)

#     def set_password(self, password):
#     self.password = generate_password_hash(password)

#     def check_password(self, password):
#     return check_password_hash(self.password, password)

#     def to_dict(self):
#         return {
#             'id':         self.id,
#             'name':       self.name,
#             'email':      self.email,
#             'role':       self.role,
#             'is_active':  self.is_active,
#             'created_at': self.created_at.isoformat()
#         }

#     def __repr__(self):
#         return f'<User {self.email} | {self.role}>'





from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(100), nullable=False)
    email      = db.Column(db.String(120), unique=True, nullable=False)
    password   = db.Column(db.String(255), nullable=False)
    role       = db.Column(db.Enum('admin', 'manager', 'staff'),
                           nullable=False, default='staff')
    is_active  = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow,
                           onupdate=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id':         self.id,
            'name':       self.name,
            'email':      self.email,
            'role':       self.role,
            'is_active':  self.is_active,
            'created_at': self.created_at.isoformat()
        }

    def __repr__(self):
        return f'<User {self.email} | {self.role}>'