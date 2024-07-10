import base64
import os
from app import mongo
from bson.objectid import ObjectId
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, DateTimeField, FileField
from wtforms.validators import DataRequired, Length, InputRequired
from datetime import date, datetime
from werkzeug.utils import secure_filename
import re
from pathlib import Path


def get_tasks_collection():
    return mongo.db.tasks


def get_users_collection():
    return mongo.db.users


def get_task(task_id, user_id):
    tasks = get_tasks_collection()
    res = tasks.find_one({"_id": ObjectId(task_id), "user_id": user_id})
    res = {**res, '_id': str(res['_id']),
           'user_id': str(res['user_id']), 'due_date': str(res['due_date'])} if res else {}
    return res


def add_task(task):
    # Convert due_date to datetime if it exists and is a string
    if 'due_date' in task and isinstance(task['due_date'], str):
        try:
            task['due_date'] = datetime.strptime(
                task['due_date'], '%Y-%m-%dT%H:%M')
        except ValueError:
            task['due_date'] = datetime.combine(datetime.strptime(
                task['due_date'], '%Y-%m-%d').date(), datetime.min.time())
    tasks = get_tasks_collection()
    return tasks.insert_one(task).inserted_id


def update_task(task_id, task, user_id):
    # Convert due_date to datetime if it exists and is a string
    if 'due_date' in task and isinstance(task['due_date'], str):
        try:
            task['due_date'] = datetime.strptime(
                task['due_date'], '%Y-%m-%dT%H:%M')
        except ValueError:
            task['due_date'] = datetime.combine(datetime.strptime(
                task['due_date'], '%Y-%m-%d').date(), datetime.min.time())
    tasks = get_tasks_collection()
    return tasks.update_one({"_id": ObjectId(task_id), "user_id": user_id}, {"$set": task})


def delete_task(task_id, user_id):
    tasks = get_tasks_collection()
    return tasks.delete_one({"_id": ObjectId(task_id), "user_id": user_id})


def get_all_tasks(user_id, sort_by='title', order='asc'):
    tasks = get_tasks_collection()
    sort_order = 1 if order == 'asc' else -1
    data = tasks.find({"user_id": user_id}).sort(sort_by, sort_order)
    data = [{**res, '_id': str(res['_id']),
             'user_id': str(res['user_id']), 'due_date': str(res['due_date'])} for res in data]
    return data


def search_tasks(user_id, query):
    tasks = get_tasks_collection()
    regex = re.compile(f'.*{query}.*', re.IGNORECASE)
    data = tasks.find({"user_id": user_id, "$or": [
                      {"title": regex}, {"description": regex}]})
    data = [{**res, '_id': str(res['_id']),
             'user_id': str(res['user_id']), 'due_date': str(res['due_date'])} for res in data]
    return data


def get_user_by_username(username):
    users = get_users_collection()
    return users.find_one({"username": username})


def get_user_by_id(user_id):
    users = get_users_collection()
    return users.find_one({"_id": ObjectId(user_id)})


def add_user(user):
    users = get_users_collection()
    return users.insert_one(user).inserted_id


def update_user(user_id, user_data):
    users = get_users_collection()
    return users.update_one({"_id": ObjectId(user_id)}, {"$set": user_data})


def save_avatar(file):
    encoded_string = base64.b64encode(file.read()).decode('utf-8')
    return encoded_string


class TaskForm(FlaskForm):
    csrf = False
    title = StringField('Title', validators=[
                        DataRequired(), Length(min=1, max=100)])
    description = TextAreaField('Description', validators=[
                                DataRequired(), Length(min=1, max=500)])
    status = SelectField('Status', choices=[('To Do', 'To Do'), (
        'In Progress', 'In Progress'), ('Done', 'Done')], validators=[DataRequired()])
    due_date = DateTimeField('Due Date', format='%Y-%m-%d %H:%M',
                             validators=[InputRequired()])
    avatar = FileField('Avatar')
