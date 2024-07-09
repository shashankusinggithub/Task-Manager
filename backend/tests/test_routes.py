import json
import unittest
from flask_jwt_extended import create_access_token
from app import create_app
from app.models import get_tasks_collection, get_users_collection
from bson.objectid import ObjectId

from utils import clean_string


class TaskTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.task_db = get_tasks_collection()
        self.user_db = get_users_collection()
        self.task_db.delete_many({})  # Clear the database before each test
        self.user_db.delete_many({})  # Clear the database before each test

        # Create a test user and get a token
        self.client.post('/auth/register', json={
            "username": "testuser",
            "password": "testpass"
        })
        response = self.client.post('/auth/login', json={
            "username": "testuser",
            "password": "testpass"
        })
        self.access_token = response.json["access_token"]

        self.headers = {
            'Authorization': f'Bearer {self.access_token}'
        }

    def test_create_task(self):
        response = self.client.post('/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "To Do"
        }, headers=self.headers)
        self.assertEqual(response.status_code, 201)
        task_id = clean_string(response.data.decode())
        self.assertTrue(ObjectId.is_valid(ObjectId(str(task_id))))

    def test_get_all_tasks(self):
        # Add a task
        self.client.post('/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "To Do"
        }, headers=self.headers)

        response = self.client.get('/tasks', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        tasks = response.json
        self.assertTrue(tasks)

    def test_get_task_by_id(self):
        # Add a task
        response = self.client.post('/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "To Do"
        }, headers=self.headers)
        task_id = clean_string(response.data.decode())
        self.assertTrue(ObjectId.is_valid(ObjectId(str(task_id))))

        # Get the task by ID
        response = self.client.get(f'/tasks/{task_id}', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        task = json.loads(response.json)
        self.assertEqual(task['title'], "New Task")

    def test_update_task(self):
        # Add a task
        response = self.client.post('/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "To Do"
        }, headers=self.headers)

        task_id = clean_string(response.data.decode())
        self.assertTrue(ObjectId.is_valid(ObjectId(str(task_id))))

        # Update the task
        response = self.client.put(f'/tasks/{task_id}', json={
            "title": "Updated Task",
            "description": "Updated Description",
            "status": "In Progress"
        }, headers=self.headers)
        self.assertEqual(response.status_code, 204)

        # Verify the update
        response = self.client.get(f'/tasks/{task_id}', headers=self.headers)
        task = json.loads(response.json)

        self.assertEqual(task['title'], "Updated Task")
        self.assertEqual(task['status'], "In Progress")

    def test_delete_task(self):
        # Add a task
        response = self.client.post('/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "To Do"
        }, headers=self.headers)
        task_id = clean_string(response.data.decode())
        self.assertTrue(ObjectId.is_valid(ObjectId(str(task_id))))

        # Delete the task
        response = self.client.delete(
            f'/tasks/{task_id}', headers=self.headers)
        self.assertEqual(response.status_code, 204)

        # Verify the task is deleted
        response = self.client.get(f'/tasks/{task_id}', headers=self.headers)
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()
