import pytest
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.room import Room
from app.models.resident import Resident


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
            room_type    = 'double',
            status       = 'available',
            capacity     = 2,
            monthly_rent = 8000.0
        )
        db.session.add(room)
        db.session.commit()
        return room.id


@pytest.fixture
def sample_resident(app):
    with app.app_context():
        resident = Resident(
            name        = 'Test Resident',
            email       = 'resident@test.com',
            phone       = '+91 9876543210',
            national_id = 'IND1234567890',
            is_active   = True
        )
        db.session.add(resident)
        db.session.commit()
        return resident.id


# ─── GET Residents Tests ───────────────────────────────────────
class TestGetResidents:

    def test_get_all_residents_as_staff(self, client, staff_token):
        res = client.get('/api/residents/',
                         headers={'Authorization': f'Bearer {staff_token}'})

        assert res.status_code == 200
        assert res.get_json()['success'] == True

    def test_get_resident_by_id(self, client, staff_token, sample_resident):
        res = client.get(f'/api/residents/{sample_resident}',
                         headers={'Authorization': f'Bearer {staff_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert data['data']['email'] == 'resident@test.com'

    def test_get_resident_not_found(self, client, staff_token):
        res = client.get('/api/residents/9999',
                         headers={'Authorization': f'Bearer {staff_token}'})

        assert res.status_code == 404

    def test_get_residents_no_token(self, client):
        res = client.get('/api/residents/')

        assert res.status_code == 401

    def test_get_residents_pagination(self, client, staff_token):
        res = client.get('/api/residents/?page=1&per_page=5',
                         headers={'Authorization': f'Bearer {staff_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert 'pagination' in data


# ─── CREATE Resident Tests ─────────────────────────────────────
class TestCreateResident:

    def test_create_resident_success(self, client, manager_token):
        res = client.post('/api/residents/',
                          data=json.dumps({
                              'name':        'John Doe',
                              'email':       'john@test.com',
                              'phone':       '+91 9876543210',
                              'national_id': 'IND9876543210'
                          }),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {manager_token}'})
        data = res.get_json()

        assert res.status_code == 201
        assert data['success'] == True
        assert data['data']['name'] == 'John Doe'

    def test_create_resident_missing_fields(self, client, manager_token):
        res = client.post('/api/residents/',
                          data=json.dumps({'name': 'John'}),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {manager_token}'})
        data = res.get_json()

        assert res.status_code == 422
        assert 'missing' in data['errors']

    def test_create_resident_invalid_email(self, client, manager_token):
        res = client.post('/api/residents/',
                          data=json.dumps({
                              'name':        'John Doe',
                              'email':       'notanemail',
                              'phone':       '+91 9876543210',
                              'national_id': 'IND1111111111'
                          }),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 400

    def test_create_resident_duplicate_email(self, client, manager_token,
                                              sample_resident):
        res = client.post('/api/residents/',
                          data=json.dumps({
                              'name':        'Another Person',
                              'email':       'resident@test.com',
                              'phone':       '+91 9999999999',
                              'national_id': 'IND9999999999'
                          }),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 409

    def test_create_resident_staff_forbidden(self, client, staff_token):
        res = client.post('/api/residents/',
                          data=json.dumps({
                              'name':        'Jane Doe',
                              'email':       'jane@test.com',
                              'phone':       '+91 8888888888',
                              'national_id': 'IND8888888888'
                          }),
                          content_type='application/json',
                          headers={'Authorization': f'Bearer {staff_token}'})

        assert res.status_code == 403


# ─── ASSIGN Room Tests ─────────────────────────────────────────
class TestAssignRoom:

    def test_assign_room_success(self, client, manager_token,
                                  sample_resident, sample_room):
        res = client.patch(f'/api/residents/{sample_resident}/assign-room',
                           data=json.dumps({'room_id': sample_room}),
                           content_type='application/json',
                           headers={'Authorization': f'Bearer {manager_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert data['data']['room_id'] == sample_room

    def test_assign_room_not_found(self, client, manager_token, sample_resident):
        res = client.patch(f'/api/residents/{sample_resident}/assign-room',
                           data=json.dumps({'room_id': 9999}),
                           content_type='application/json',
                           headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 404

    def test_assign_room_missing_room_id(self, client, manager_token,
                                          sample_resident):
        res = client.patch(f'/api/residents/{sample_resident}/assign-room',
                           data=json.dumps({}),
                           content_type='application/json',
                           headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 400


# ─── CHECKOUT Tests ────────────────────────────────────────────
class TestCheckout:

    def test_checkout_success(self, client, manager_token,
                               sample_resident, sample_room, app):
        # First assign
        client.patch(f'/api/residents/{sample_resident}/assign-room',
                     data=json.dumps({'room_id': sample_room}),
                     content_type='application/json',
                     headers={'Authorization': f'Bearer {manager_token}'})

        # Then checkout
        res = client.patch(f'/api/residents/{sample_resident}/checkout',
                           content_type='application/json',
                           headers={'Authorization': f'Bearer {manager_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert data['data']['room_id'] is None
        assert data['data']['is_active'] == False

    def test_checkout_not_assigned(self, client, manager_token, sample_resident):
        res = client.patch(f'/api/residents/{sample_resident}/checkout',
                           content_type='application/json',
                           headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 400


# ─── DELETE Resident Tests ─────────────────────────────────────
class TestDeleteResident:

    def test_delete_resident_success(self, client, manager_token,
                                      sample_resident):
        res = client.delete(f'/api/residents/{sample_resident}',
                            headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 200

    def test_delete_resident_not_found(self, client, manager_token):
        res = client.delete('/api/residents/9999',
                            headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 404

    def test_delete_resident_with_room_fails(self, client, manager_token,
                                              sample_resident, sample_room):
        # Assign room first
        client.patch(f'/api/residents/{sample_resident}/assign-room',
                     data=json.dumps({'room_id': sample_room}),
                     content_type='application/json',
                     headers={'Authorization': f'Bearer {manager_token}'})

        # Try to delete — should fail
        res = client.delete(f'/api/residents/{sample_resident}',
                            headers={'Authorization': f'Bearer {manager_token}'})

        assert res.status_code == 400