import re


def validate_email(email):
    """
    Returns True if email is valid, False otherwise.

    Usage:
        if not validate_email(data['email']):
            return error_response("Invalid email format")
    """
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    return bool(re.match(pattern, email))


def validate_phone(phone):
    """
    Returns True if phone has 7-15 digits (international format).

    Usage:
        if not validate_phone(data['phone']):
            return error_response("Invalid phone number")
    """
    pattern = r'^\+?[\d\s\-]{7,15}$'
    return bool(re.match(pattern, phone))


def validate_required_fields(data, required_fields):
    """
    Checks if all required fields exist and are non-empty in data dict.
    Returns list of missing fields.

    Usage:
        missing = validate_required_fields(data, ['name', 'email', 'role'])
        if missing:
            return error_response(
                "Missing required fields",
                errors={'missing': missing}
            )
    """
    missing = []
    for field in required_fields:
        if field not in data or data[field] is None or str(data[field]).strip() == '':
            missing.append(field)
    return missing


def validate_room_number(room_number):
    """
    Room number must be alphanumeric, 1-10 chars.
    e.g. '101', 'A-201', 'B302'

    Usage:
        if not validate_room_number(data['room_number']):
            return error_response("Invalid room number format")
    """
    pattern = r'^[A-Za-z0-9\-]{1,10}$'
    return bool(re.match(pattern, room_number))


def validate_rent(rent):
    """
    Rent must be a positive number.

    Usage:
        if not validate_rent(data['monthly_rent']):
            return error_response("Rent must be a positive number")
    """
    try:
        return float(rent) >= 0
    except (ValueError, TypeError):
        return False


def validate_floor(floor):
    """
    Floor must be a positive integer between 0 and 200.

    Usage:
        if not validate_floor(data['floor']):
            return error_response("Invalid floor number")
    """
    try:
        return 0 <= int(floor) <= 200
    except (ValueError, TypeError):
        return False


def validate_capacity(capacity):
    """
    Capacity must be between 1 and 10.

    Usage:
        if not validate_capacity(data['capacity']):
            return error_response("Capacity must be between 1 and 10")
    """
    try:
        return 1 <= int(capacity) <= 10
    except (ValueError, TypeError):
        return False


def validate_role(role):
    """
    Role must be one of admin, manager, staff.

    Usage:
        if not validate_role(data['role']):
            return error_response("Invalid role")
    """
    return role in ['admin', 'manager', 'staff']


def validate_room_status(status):
    """
    Status must be one of available, occupied, maintenance.

    Usage:
        if not validate_room_status(data['status']):
            return error_response("Invalid room status")
    """
    return status in ['available', 'occupied', 'maintenance']


def validate_room_type(room_type):
    """
    Room type must be one of single, double, suite.

    Usage:
        if not validate_room_type(data['room_type']):
            return error_response("Invalid room type")
    """
    return room_type in ['single', 'double', 'suite']