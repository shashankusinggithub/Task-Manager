from flask_restful import Resource
from flask import json, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import get_all_tasks, get_task, add_task, update_task, delete_task
from bson.objectid import ObjectId
from bson.json_util import dumps, loads


class Task(Resource):
    @jwt_required()
    def get(self, task_id):
        user_id = get_jwt_identity()
        task = get_task(ObjectId(task_id), user_id)
        if not task:
            return {"message": "Task not found"}, 404
        return loads(dumps(task)), 200

    @jwt_required()
    def put(self, task_id):
        user_id = get_jwt_identity()
        task = request.json
        update_task(ObjectId(task_id), task, user_id)
        return '', 204

    @jwt_required()
    def delete(self, task_id):
        user_id = get_jwt_identity()
        delete_task(ObjectId(task_id), user_id)
        return '', 204


class TaskList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        tasks = get_all_tasks(user_id)
        if not tasks:
            return {"message": "Task not found"}, 404
        print(tasks)

        tasks = [{**item, '_id': str(item['_id']),
                 'user_id': str(item['user_id'])}
                 for item in tasks]
        return tasks, 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        task = request.json
        task["user_id"] = user_id
        task_id = add_task(task)
        return str(task_id), 201


def initialize_routes(api):
    api.add_resource(TaskList, '/api/tasks')
    api.add_resource(Task, '/api/tasks/<string:task_id>')
