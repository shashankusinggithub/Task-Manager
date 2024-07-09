from flask_restful import Resource
from flask import json, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import get_all_tasks, get_task, add_task, update_task, delete_task, TaskForm
from bson.objectid import ObjectId
from bson.json_util import dumps, loads


def validate_form(form):
    if not form.validate():
        return {field: error[0] for field, error in form.errors.items()}
    return None


class Task(Resource):
    @jwt_required()
    def get(self, task_id):
        user_id = get_jwt_identity()
        task = get_task(ObjectId(task_id), user_id)
        if not task:
            return {"message": "Task not found"}, 404
        task = {**task, '_id': str(task['_id']),
                'user_id': str(task['user_id'])}
        return (task), 200

    @jwt_required()
    def put(self, task_id):
        user_id = get_jwt_identity()
        form = TaskForm(data=request.json)
        if form.validate():
            task = form.data
            update_task(ObjectId(task_id), task, user_id)
            return '', 204
        return jsonify({"message": "Invalid task data", "errors": form.errors}), 400

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
        tasks = [{**item, '_id': str(item['_id']),
                 'user_id': str(item['user_id'])}
                 for item in tasks]
        return tasks, 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        print(request.json)
        form = TaskForm(data=request.json)
        if form.validate():
            task = form.data
            task["user_id"] = user_id
            task_id = add_task(task)
            return str(task_id), 201
        return {"message": "Invalid task data", "errors": form.errors}, 400


def initialize_routes(api):
    api.add_resource(TaskList, '/api/tasks')
    api.add_resource(Task, '/api/tasks/<string:task_id>')
