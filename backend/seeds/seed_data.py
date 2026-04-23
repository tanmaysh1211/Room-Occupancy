import sys
import os

# Add backend/ to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db, bcrypt
from app.models.user import User
from app.models.room import Room
from app.models.resident import Resident
from app.models.audit_log import AuditLog
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker('en_IN')  # Indian locale for realistic data

app = create_app('development')

# ─── Config ────────────────────────────────────────────────────
TOTAL_FLOORS    = 10
ROOMS_PER_FLOOR = 12   # = 120 total rooms
TOTAL_RESIDENTS = 200

ROOM_TYPES    = ['single', 'double', 'suite']
ROOM_STATUSES = ['available', 'occupied', 'maintenance']

RENT_MAP = {
    'single': (4000,  8000),
    'double': (7000,  14000),
    'suite':  (15000, 30000)
}

# ─── Helper ────────────────────────────────────────────────────
def random_date(start_days_ago=365, end_days_ago=0):
    start = datetime.utcnow() - timedelta(days=start_days_ago)
    end   = datetime.utcnow() - timedelta(days=end_days_ago)
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds()))
    )


def clear_all():
    print("🗑️  Clearing existing data...")
    AuditLog.query.delete()
    Resident.query.delete()
    Room.query.delete()
    User.query.delete()
    db.session.commit()
    print("✅ Cleared all tables")


def seed_users():
    print("\n👤 Seeding users...")

    users = [
        # Admin
        User(name='Tanmay Sharma', email='admin@roomoccupancy.com',
             role='admin', is_active=True),
        # Managers
        User(name='Priya Mehta',   email='manager1@roomoccupancy.com',
             role='manager', is_active=True),
        User(name='Rahul Verma',   email='manager2@roomoccupancy.com',
             role='manager', is_active=True),
        # Staff
        User(name='Anjali Singh',  email='staff1@roomoccupancy.com',
             role='staff', is_active=True),
        User(name='Vikram Patel',  email='staff2@roomoccupancy.com',
             role='staff', is_active=True),
        User(name='Neha Gupta',    email='staff3@roomoccupancy.com',
             role='staff', is_active=True),
    ]

    for user in users:
        user.set_password('password123')
        db.session.add(user)

    db.session.commit()
    print(f"✅ Seeded {len(users)} users")
    return users


def seed_rooms():
    print("\n🏠 Seeding rooms...")
    rooms = []

    for floor in range(1, TOTAL_FLOORS + 1):
        for room_num in range(1, ROOMS_PER_FLOOR + 1):

            # Room number like 101, 102 ... 1012, 201 ...
            room_number = f"{floor}{str(room_num).zfill(2)}"
            room_type   = random.choices(
                ROOM_TYPES,
                weights=[60, 30, 10]  # 60% single, 30% double, 10% suite
            )[0]

            rent_min, rent_max = RENT_MAP[room_type]
            monthly_rent = round(random.uniform(rent_min, rent_max), 2)

            # Mostly available, some occupied, few maintenance
            status = random.choices(
                ROOM_STATUSES,
                weights=[40, 50, 10]
            )[0]

            room = Room(
                room_number  = room_number,
                floor        = floor,
                room_type    = room_type,
                status       = status,
                capacity     = 1 if room_type == 'single' else
                               2 if room_type == 'double' else 3,
                monthly_rent = monthly_rent,
                description  = f"{'Cozy' if room_type == 'single' else 'Spacious' if room_type == 'double' else 'Luxurious'} "
                               f"{room_type} room on floor {floor} "
                               f"with {'basic' if room_type == 'single' else 'premium'} amenities."
            )
            rooms.append(room)
            db.session.add(room)

    db.session.commit()
    print(f"✅ Seeded {len(rooms)} rooms across {TOTAL_FLOORS} floors")
    return rooms


def seed_residents(rooms):
    print("\n👥 Seeding residents...")

    # Get occupied rooms to assign residents to
    occupied_rooms    = [r for r in rooms if r.status == 'occupied']
    available_rooms   = [r for r in rooms if r.status == 'available']
    used_emails       = set()
    used_national_ids = set()
    residents         = []
    assigned_count    = 0

    for i in range(TOTAL_RESIDENTS):
        # Generate unique email
        while True:
            email = fake.email()
            if email not in used_emails:
                used_emails.add(email)
                break

        # Generate unique national ID
        while True:
            national_id = f"IND{fake.numerify('##########')}"
            if national_id not in used_national_ids:
                used_national_ids.add(national_id)
                break

        check_in  = random_date(365, 1)
        is_active = random.choice([True, True, True, False])  # 75% active

        resident = Resident(
            name        = fake.name(),
            email       = email,
            phone       = f"+91 {fake.numerify('##########')}",
            national_id = national_id,
            emergency_contact_name  = fake.name(),
            emergency_contact_phone = f"+91 {fake.numerify('##########')}",
            is_active   = is_active,
            check_in    = check_in,
            check_out   = random_date(30, 0) if not is_active else None
        )

        # Assign to occupied room if active
        if is_active and occupied_rooms:
            room = random.choice(occupied_rooms)
            current_count = sum(
                1 for r in residents if r.room_id == room.id and r.is_active
            )
            if current_count < room.capacity:
                resident.room_id = room.id
                assigned_count  += 1

        residents.append(resident)
        db.session.add(resident)

    db.session.commit()
    print(f"✅ Seeded {len(residents)} residents")
    print(f"   → {assigned_count} assigned to rooms")
    print(f"   → {TOTAL_RESIDENTS - assigned_count} unassigned")
    return residents


def seed_audit_logs(users):
    print("\n📋 Seeding audit logs...")

    actions = [
        ('CREATE_ROOM',      'room'),
        ('UPDATE_ROOM',      'room'),
        ('DELETE_ROOM',      'room'),
        ('CREATE_RESIDENT',  'resident'),
        ('UPDATE_RESIDENT',  'resident'),
        ('ASSIGN_ROOM',      'resident'),
        ('CHECKOUT_RESIDENT','resident'),
        ('LOGIN',            'user'),
        ('LOGOUT',           'user'),
        ('CREATE_USER',      'user'),
    ]

    logs = []
    for _ in range(150):  # 150 sample log entries
        user   = random.choice(users)
        action, entity_type = random.choice(actions)

        log = AuditLog(
            user_id     = user.id,
            user_email  = user.email,
            user_role   = user.role,
            action      = action,
            entity_type = entity_type,
            entity_id   = random.randint(1, 100),
            description = f'{action.replace("_", " ").title()} performed by {user.email}',
            ip_address  = fake.ipv4(),
            timestamp   = random_date(90, 0)
        )
        logs.append(log)
        db.session.add(log)

    db.session.commit()
    print(f"✅ Seeded {len(logs)} audit log entries")


def print_summary(users, rooms, residents):
    print("\n" + "=" * 50)
    print("        SEED COMPLETE — SUMMARY")
    print("=" * 50)
    print(f"  Users        : {len(users)}")
    print(f"  Rooms        : {len(rooms)}")
    print(f"    → Single   : {sum(1 for r in rooms if r.room_type == 'single')}")
    print(f"    → Double   : {sum(1 for r in rooms if r.room_type == 'double')}")
    print(f"    → Suite    : {sum(1 for r in rooms if r.room_type == 'suite')}")
    print(f"    → Available: {sum(1 for r in rooms if r.status == 'available')}")
    print(f"    → Occupied : {sum(1 for r in rooms if r.status == 'occupied')}")
    print(f"    → Maintain : {sum(1 for r in rooms if r.status == 'maintenance')}")
    print(f"  Residents    : {len(residents)}")
    print(f"    → Active   : {sum(1 for r in residents if r.is_active)}")
    print(f"    → Inactive : {sum(1 for r in residents if not r.is_active)}")
    print("=" * 50)
    print("\n🔑 Login Credentials:")
    print("  Admin   → admin@roomoccupancy.com   / password123")
    print("  Manager → manager1@roomoccupancy.com / password123")
    print("  Staff   → staff1@roomoccupancy.com   / password123")
    print("=" * 50)


# ─── Run ───────────────────────────────────────────────────────
if __name__ == '__main__':
    with app.app_context():
        clear_all()
        users     = seed_users()
        rooms     = seed_rooms()
        residents = seed_residents(rooms)
        seed_audit_logs(users)
        print_summary(users, rooms, residents)