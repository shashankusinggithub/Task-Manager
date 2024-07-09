from app import mongo
from bson.objectid import ObjectId
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField
from wtforms.validators import DataRequired, Length


def get_tasks_collection():
    return mongo.db.tasks


def get_users_collection():
    return mongo.db.users


def get_task(task_id, user_id):
    tasks = get_tasks_collection()
    return tasks.find_one({"_id": ObjectId(task_id), "user_id": user_id})


def add_task(task):
    tasks = get_tasks_collection()
    return tasks.insert_one(task).inserted_id


def update_task(task_id, task, user_id):
    tasks = get_tasks_collection()
    return tasks.update_one({"_id": ObjectId(task_id), "user_id": user_id}, {"$set": task})


def delete_task(task_id, user_id):
    tasks = get_tasks_collection()
    print(task_id, user_id, "deleted")
    return tasks.delete_one({"_id": ObjectId(task_id), "user_id": user_id})


def get_all_tasks(user_id):
    tasks = get_tasks_collection()
    return tasks.find({"user_id": user_id})


def get_user_by_username(username):
    users = get_users_collection()
    return users.find_one({"username": username})


def add_user(user):
    users = get_users_collection()
    return users.insert_one(user).inserted_id


class TaskForm(FlaskForm):
    csrf = False
    title = StringField('Title', validators=[
                        DataRequired(), Length(min=1, max=100)])
    description = TextAreaField('Description', validators=[DataRequired(),
                                Length(min=1, max=500)])
    status = SelectField('Status', choices=[('To Do', 'To Do'), (
        'In Progress', 'In Progress'), ('Done', 'Done')], validators=[DataRequired()])
