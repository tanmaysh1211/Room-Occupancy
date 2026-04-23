from flask import jsonify


def success_response(message, data=None, status_code=200):
    """
    Standard success response format for all API endpoints.

    Usage:
        return success_response("Room created", data=room.to_dict(), status_code=201)
    """
    response = {
        'success': True,
        'message': message,
    }
    if data is not None:
        response['data'] = data

    return jsonify(response), status_code


def error_response(message, errors=None, status_code=400):
    """
    Standard error response format for all API endpoints.

    Usage:
        return error_response("Room not found", status_code=404)
        return error_response("Validation failed", errors={"email": "Invalid email"})
    """
    response = {
        'success': False,
        'message': message,
    }
    if errors is not None:
        response['errors'] = errors

    return jsonify(response), status_code


def paginated_response(message, items, total, page, per_page):
    """
    Paginated response for list endpoints.

    Usage:
        return paginated_response(
            message  = "Rooms fetched",
            items    = [r.to_dict() for r in rooms],
            total    = total_count,
            page     = page,
            per_page = per_page
        )
    """
    return jsonify({
        'success':    True,
        'message':    message,
        'data':       items,
        'pagination': {
            'total':       total,
            'page':        page,
            'per_page':    per_page,
            'total_pages': (total + per_page - 1) // per_page
        }
    }), 200