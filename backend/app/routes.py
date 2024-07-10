from flask_restful import Resource
from flask import json, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import *
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
        return task, 200

    @jwt_required()
    def put(self, task_id):
        user_id = get_jwt_identity()
        form = TaskForm(data=request.json)
        if form.validate():
            task = form.data
            update_task(ObjectId(task_id), task, user_id)
            return '', 204
        return {"message": "Invalid task data", "errors": form.errors}, 400

    @jwt_required()
    def delete(self, task_id):
        user_id = get_jwt_identity()
        delete_task(ObjectId(task_id), user_id)
        return '', 204


class TaskList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        sort_by = request.args.get('sort_by', 'title')
        order = request.args.get('order', 'asc')
        filter = request.args.get('filter', 'All')
        query = request.args.get('query', '')

        tasks = get_all_tasks(user_id, sort_by, order, filter, query)
        return list(tasks), 200

    @ jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        form = TaskForm(data=request.json)
        if form.validate():
            task = form.data
            task["user_id"] = user_id
            task_id = add_task(task)
            return str(task_id), 201
        return {"message": "Invalid task data", "errors": form.errors}, 400


class Profile(Resource):
    @ jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = get_user_by_id(user_id)
        if not user:
            return {"message": "User not found"}, 404
        return {**user, '_id': str(user['_id']),
                }, 201

    @ jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        username = request.form.get('username')
        avatar = request.files.get('avatar')

        user_data = {}
        if username:
            user_data['username'] = username

        if avatar:
            avatar_base64 = save_avatar(avatar)
            user_data['avatar'] = avatar_base64

        if user_data:
            update_user(user_id, user_data)

        return '', 204


class TaskSearch(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        filter = request.args.get('filter', 'All')
        sort_by = request.args.get('sort_by', 'title')
        order = request.args.get('order', 'asc')
        query = request.args.get('query', '')

        tasks = search_tasks(user_id, filter, sort_by, order, query)
        return list(tasks), 200


def initialize_routes(api):
    api.add_resource(TaskList, '/api/tasks')
    api.add_resource(Task, '/api/tasks/<string:task_id>')
    api.add_resource(TaskSearch, '/api/tasks/search')
    api.add_resource(Profile, '/api/profile')
