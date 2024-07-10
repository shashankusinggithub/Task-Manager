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
        self.client.post('/api/auth/register', json={
            "username": "testuser",
            "password": "testpass"
        })
        response = self.client.post('/api/auth/login', json={
            "username": "testuser",
            "password": "testpass"
        })
        self.access_token = response.json["access_token"]

        self.headers = {
            'Authorization': f'Bearer {self.access_token}'
        }

    def test_create_task(self):
        response = self.client.post('/api/tasks', json={
            'title': 'Test Task',
            'description': 'This is a test task',
            'status': 'To Do',
            'due_date': '2024-08-01 05:35'
        }, headers=self.headers)
        self.assertEqual(response.status_code, 201)
        task_id = clean_string(response.data.decode())
        self.assertTrue(ObjectId.is_valid(ObjectId(str(task_id))))

    def test_create_task_with_invalid_status(self):
        response = self.client.post('/api/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "Invalid Status"
        }, headers=self.headers)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Not a valid choice.", response.json["errors"]['status'])

    def test_create_task_without_title(self):
        response = self.client.post('/api/tasks', json={
            "description": "Task Description",
            "status": "To Do"
        }, headers=self.headers)
        self.assertEqual(response.status_code, 400)
        self.assertIn("This field is required",
                      response.json["errors"]['title'][0])

    def test_get_all_tasks(self):
        # Add a task
        self.client.post('/api/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "To Do",
            'due_date': '2024-08-01 05:35'
        }, headers=self.headers)

        response = self.client.get('/api/tasks', headers=self.headers)
        self.assertEqual(response.status_code, 200)

    def test_get_task_by_id(self):
        # Add a task
        response = self.client.post('/api/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "To Do",
            'due_date': '2024-08-01 05:35'
        }, headers=self.headers)
        task_id = clean_string(response.data.decode())
        self.assertTrue(ObjectId.is_valid(ObjectId(str(task_id))))

        # Get the task by ID
        response = self.client.get(
            f'/api/tasks/{task_id}', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        task = response.json
        self.assertEqual(task['title'], "New Task")

    def test_update_task(self):
        # Add a task
        response = self.client.post('/api/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "To Do",
            'due_date': '2024-08-01 05:35'
        }, headers=self.headers)

        task_id = clean_string(response.data.decode())
        self.assertTrue(ObjectId.is_valid(ObjectId(str(task_id))))

        # Update the task
        response = self.client.put(f'/api/tasks/{task_id}', json={
            "title": "Updated Task",
            "description": "Updated Description",
            "status": "In Progress",
            'due_date': '2024-08-01 05:35'
        }, headers=self.headers)
        self.assertEqual(response.status_code, 204)

        # Verify the update
        response = self.client.get(
            f'/api/tasks/{task_id}', headers=self.headers)
        task = response.json

        self.assertEqual(task['title'], "Updated Task")
        self.assertEqual(task['status'], "In Progress")

    def test_delete_task(self):
        # Add a task
        response = self.client.post('/api/tasks', json={
            "title": "New Task",
            "description": "Task Description",
            "status": "To Do",
            'due_date': '2024-08-01 05:35'
        }, headers=self.headers)
        print(response.data)
        task_id = clean_string(response.data.decode())
        self.assertTrue(ObjectId.is_valid(ObjectId(str(task_id))))
        response = self.client.delete(
            f'/api/tasks/{task_id}', headers=self.headers)
        self.assertEqual(response.status_code, 204)

        # Verify the task is deleted
        response = self.client.get(
            f'/api/tasks/{task_id}', headers=self.headers)
        self.assertEqual(response.status_code, 404)

    def test_search_tasks(self):
        # Add tasks
        self.client.post('/api/tasks', json={
            "title": "First Task",
            "description": "First Description",
            "status": "To Do",
            'due_date': '2024-08-01 05:35'
        }, headers=self.headers)
        self.client.post('/api/tasks', json={
            "title": "Second Task",
            "description": "Second Description",
            "status": "In Progress",
            'due_date': '2024-08-01 05:35'
        }, headers=self.headers)

        # Search tasks
        response = self.client.get(
            '/api/tasks/search?query=First', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        tasks = response.json
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]['title'], "First Task")


if __name__ == '__main__':
    unittest.main()
