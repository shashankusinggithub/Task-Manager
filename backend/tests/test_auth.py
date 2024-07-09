import unittest
from app import create_app
from app.models import get_users_collection


class AuthTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.db = get_users_collection()
        self.db.delete_many({})  # Clear the database before each test

    def test_register_user(self):
        response = self.client.post('/auth/register', json={
            "username": "testuser",
            "password": "testpass"
        })
        self.assertEqual(response.status_code, 201)

    def test_login_user(self):
        self.client.post('/auth/register', json={
            "username": "testuser",
            "password": "testpass"
        })
        response = self.client.post('/auth/login', json={
            "username": "testuser",
            "password": "testpass"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.json)


if __name__ == '__main__':
    unittest.main()
