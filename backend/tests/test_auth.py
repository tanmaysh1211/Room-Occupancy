import pytest
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User


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
        user = User(
            name  = 'Admin User',
            email = 'admin@test.com',
            role  = 'admin'
        )
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        return {'email': 'admin@test.com', 'password': 'password123',
                'id': user.id}


@pytest.fixture
def staff_user(app):
    with app.app_context():
        user = User(
            name  = 'Staff User',
            email = 'staff@test.com',
            role  = 'staff'
        )
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        return {'email': 'staff@test.com', 'password': 'password123',
                'id': user.id}


@pytest.fixture
def admin_token(client, admin_user):
    res = client.post('/api/auth/login',
                      data=json.dumps({
                          'email':    admin_user['email'],
                          'password': admin_user['password']
                      }),
                      content_type='application/json')
    return res.get_json()['data']['access_token']


# ─── Login Tests ───────────────────────────────────────────────
class TestLogin:

    def test_login_success(self, client, admin_user):
        res = client.post('/api/auth/login',
                          data=json.dumps({
                              'email':    admin_user['email'],
                              'password': admin_user['password']
                          }),
                          content_type='application/json')
        data = res.get_json()

        assert res.status_code == 200
        assert data['success'] == True
        assert 'access_token'  in data['data']
        assert 'refresh_token' in data['data']
        assert data['data']['user']['email'] == admin_user['email']
        assert data['data']['user']['role']  == 'admin'

    def test_login_wrong_password(self, client, admin_user):
        res = client.post('/api/auth/login',
                          data=json.dumps({
                              'email':    admin_user['email'],
                              'password': 'wrongpassword'
                          }),
                          content_type='application/json')
        data = res.get_json()

        assert res.status_code == 401
        assert data['success'] == False
        assert 'Invalid' in data['message']

    def test_login_wrong_email(self, client):
        res = client.post('/api/auth/login',
                          data=json.dumps({
                              'email':    'notexist@test.com',
                              'password': 'password123'
                          }),
                          content_type='application/json')

        assert res.status_code == 401
        assert res.get_json()['success'] == False

    def test_login_missing_fields(self, client):
        res = client.post('/api/auth/login',
                          data=json.dumps({'email': 'admin@test.com'}),
                          content_type='application/json')

        assert res.status_code == 400
        assert res.get_json()['success'] == False

    def test_login_empty_body(self, client):
        res = client.post('/api/auth/login',
                          data=json.dumps({}),
                          content_type='application/json')

        assert res.status_code == 400

    def test_login_returns_correct_role(self, client, staff_user):
        res = client.post('/api/auth/login',
                          data=json.dumps({
                              'email':    staff_user['email'],
                              'password': staff_user['password']
                          }),
                          content_type='application/json')
        data = res.get_json()

        assert res.status_code == 200
        assert data['data']['user']['role'] == 'staff'


# ─── /me Tests ─────────────────────────────────────────────────
class TestMe:

    def test_get_me_success(self, client, admin_user, admin_token):
        res = client.get('/api/auth/me',
                         headers={'Authorization': f'Bearer {admin_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert data['success'] == True
        assert data['data']['email'] == admin_user['email']

    def test_get_me_no_token(self, client):
        res = client.get('/api/auth/me')

        assert res.status_code == 401

    def test_get_me_invalid_token(self, client):
        res = client.get('/api/auth/me',
                         headers={'Authorization': 'Bearer invalidtoken123'})

        assert res.status_code == 422


# ─── Logout Tests ──────────────────────────────────────────────
class TestLogout:

    def test_logout_success(self, client, admin_user, admin_token):
        res = client.post('/api/auth/logout',
                          headers={'Authorization': f'Bearer {admin_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert data['success'] == True

    def test_logout_no_token(self, client):
        res = client.post('/api/auth/logout')

        assert res.status_code == 401


# ─── Change Password Tests ─────────────────────────────────────
class TestChangePassword:

    def test_change_password_success(self, client, admin_user, admin_token):
        res = client.put('/api/auth/change-password',
                         data=json.dumps({
                             'old_password': 'password123',
                             'new_password': 'newpassword456'
                         }),
                         content_type='application/json',
                         headers={'Authorization': f'Bearer {admin_token}'})
        data = res.get_json()

        assert res.status_code == 200
        assert data['success'] == True

    def test_change_password_wrong_old(self, client, admin_user, admin_token):
        res = client.put('/api/auth/change-password',
                         data=json.dumps({
                             'old_password': 'wrongpassword',
                             'new_password': 'newpassword456'
                         }),
                         content_type='application/json',
                         headers={'Authorization': f'Bearer {admin_token}'})

        assert res.status_code == 401

    def test_change_password_too_short(self, client, admin_user, admin_token):
        res = client.put('/api/auth/change-password',
                         data=json.dumps({
                             'old_password': 'password123',
                             'new_password': '123'
                         }),
                         content_type='application/json',
                         headers={'Authorization': f'Bearer {admin_token}'})

        assert res.status_code == 400

    def test_change_password_no_token(self, client):
        res = client.put('/api/auth/change-password',
                         data=json.dumps({
                             'old_password': 'password123',
                             'new_password': 'newpassword456'
                         }),
                         content_type='application/json')

        assert res.status_code == 401