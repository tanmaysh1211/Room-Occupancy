import pytest
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.room import Room


# ─── Fixtures ──────────────────────────────────────────────────
# @pytest.fixture
# def app():
#     app = create_app('testing')
#     with app.app_context():
#         db.create_all()
#         yield app
#         db.session.remove()
#         db.drop_all()


# @pytest.fixture
# def client(app):
#     return app.test_client()


@pytest.fixture
def admin_user(app):
    with app.app_context():
        user = User(name='Admin', email='admin@test.com', role='admin')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        return {'email': 'admin@test.com', 'password': 'password123'}


@pytest.fixture
def manager_user(app):
    with app.app_context():
        user = User(name='Manager', email='manager@test.com', role='manager')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        return {'email': 'manager@test.com', 'password': 'password123'}


@pytest.fixture
def staff_user(app):
    with app.app_context():
        user = User(name='Staff', email='staff@test.com', role='staff')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        return {'email': 'staff@test.com', 'password': 'password123'}


def get_token(client, email, password):
    res = client.post('/api/auth/login',
                      data=json.dumps({'email': email, 'password': password}),
                      content_type='application/json')
    return res.get_json()['data']['access_token']


@pytest.fixture
def admin_token(client, admin_user):
    return get_token(client, admin_user['email'], admin_user['password'])


@pytest.fixture
def manager_token(client, manager_user):
    return get_token(client, manager_user['email'], manager_user['password'])


@pytest.fixture
def staff_token(client, staff_user):
    return get_token(client, staff_user['email'], staff_user['password'])


@pytest.fixture
def sample_room(app):
    with app.app_context():
        room = Room(
            room_number  = '101',
            floor        = 1,
            room_type    = 'single',
            status       = 'available',
            capacity     = 1,
            monthly_rent = 5000.0
        )
        db.session.add(room)
        db.session.commit()
        return room.id


# ─── GET Rooms Tests ───────────────────────────────────────────
class TestGetRooms:

    def test_get_all_rooms_as_staff(self, client, staff_token):
        res = client.get('/api/rooms/',
                         headers={'Authorization': f'Bearer {staff_token}'})

        assert res.status_code == 200
        assert res.get_json()['success'] == True

    def test_get_all_rooms_no_token(self, client):
        res = client.get('/api/rooms/')

        assert res.status_code == 401

    def test_get_room_by_id(self, client, staff_token, sample_room):
        res = client.get(f'/api/rooms/{sample_room}',
                         headers={'Authorization': f'Bearer {staff_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert data['data']['room_number'] == '101'

    def test_get_room_not_found(self, client, staff_token):
        res = client.get('/api/rooms/9999',
                         headers={'Authorization': f'Bearer {staff_token}'})

        assert res.status_code == 404

    def test_get_rooms_filter_by_status(self, client, staff_token, sample_room):
        res = client.get('/api/rooms/?status=available',
                         headers={'Authorization': f'Bearer {staff_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert all(r['status'] == 'available' for r in data['data'])

    def test_get_rooms_pagination(self, client, staff_token):
        res = client.get('/api/rooms/?page=1&per_page=5',
                         headers={'Authorization': f'Bearer {staff_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert 'pagination' in data


# ─── CREATE Room Tests ─────────────────────────────────────────
class TestCreateRoom:

    def test_create_room_as_manager(self, client, manager_token):
        res = client.post('/api/rooms/',
                          data=json.dumps({
                              'room_number':  '201',
                              'floor':        2,
                              'room_type':    'double',
                              'monthly_rent': 8000
                          }),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {manager_token}'})
        data = res.get_json()

        assert res.status_code == 201
        assert data['success'] == True
        assert data['data']['room_number'] == '201'

    def test_create_room_as_staff_forbidden(self, client, staff_token):
        res = client.post('/api/rooms/',
                          data=json.dumps({
                              'room_number':  '301',
                              'floor':        3,
                              'room_type':    'single',
                              'monthly_rent': 5000
                          }),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {staff_token}'})

        assert res.status_code == 403

    def test_create_room_missing_fields(self, client, manager_token):
        res = client.post('/api/rooms/',
                          data=json.dumps({'room_number': '401'}),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {manager_token}'})
        data = res.get_json()

        assert res.status_code == 422
        assert 'missing' in data['errors']

    def test_create_room_duplicate_number(self, client, manager_token, sample_room):
        res = client.post('/api/rooms/',
                          data=json.dumps({
                              'room_number':  '101',
                              'floor':        1,
                              'room_type':    'single',
                              'monthly_rent': 5000
                          }),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 409

    def test_create_room_invalid_type(self, client, manager_token):
        res = client.post('/api/rooms/',
                          data=json.dumps({
                              'room_number':  '501',
                              'floor':        5,
                              'room_type':    'penthouse',
                              'monthly_rent': 50000
                          }),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 400

    def test_create_room_negative_rent(self, client, manager_token):
        res = client.post('/api/rooms/',
                          data=json.dumps({
                              'room_number':  '601',
                              'floor':        6,
                              'room_type':    'single',
                              'monthly_rent': -500
                          }),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 400


# ─── UPDATE Room Tests ─────────────────────────────────────────
class TestUpdateRoom:

    def test_update_room_success(self, client, manager_token, sample_room):
        res = client.put(f'/api/rooms/{sample_room}',
                         data=json.dumps({'monthly_rent': 7000}),
                         content_type='application/json',
                         headers={'Authorization': f'Bearer {manager_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert data['data']['monthly_rent'] == 7000

    def test_update_room_status(self, client, manager_token, sample_room):
        res = client.patch(f'/api/rooms/{sample_room}/status',
                           data=json.dumps({'status': 'maintenance'}),
                           content_type='application/json',
                           headers={'Authorization': f'Bearer {manager_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert data['data']['status'] == 'maintenance'

    def test_update_room_invalid_status(self, client, manager_token, sample_room):
        res = client.patch(f'/api/rooms/{sample_room}/status',
                           data=json.dumps({'status': 'dirty'}),
                           content_type='application/json',
                           headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 400

    def test_update_room_not_found(self, client, manager_token):
        res = client.put('/api/rooms/9999',
                         data=json.dumps({'monthly_rent': 7000}),
                         content_type='application/json',
                         headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 404


# ─── DELETE Room Tests ─────────────────────────────────────────
class TestDeleteRoom:

    def test_delete_room_success(self, client, manager_token, sample_room):
        res = client.delete(f'/api/rooms/{sample_room}',
                            headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 200
        assert res.get_json()['success'] == True

    def test_delete_room_not_found(self, client, manager_token):
        res = client.delete('/api/rooms/9999',
                            headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 404

    def test_delete_room_staff_forbidden(self, client, staff_token, sample_room):
        res = client.delete(f'/api/rooms/{sample_room}',
                            headers={'Authorization': f'Bearer {staff_token}'})

        assert res.status_code == 403