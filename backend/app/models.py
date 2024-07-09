from app import mongo
from bson.objectid import ObjectId


def get_tasks_collection():
    return mongo.db.tasks


def get_users_collection():
    return mongo.db.users


def get_task(task_id, user_id):
    tasks = get_tasks_collection()
    return tasks.find_one({"_id": ObjectId(task_id), "user_id": user_id})


def add_task(task):
    tasks = get_tasks_collection()
    data = tasks.insert_one(task).inserted_id
    return data


def update_task(task_id, task, user_id):
    tasks = get_tasks_collection()
    # Remove _id field if it exists in the task dictionary
    task.pop('_id', None)
    return tasks.update_one({"_id": ObjectId(task_id), "user_id": user_id}, {"$set": task})


def delete_task(task_id, user_id):
    tasks = get_tasks_collection()
    return tasks.delete_one({"_id": ObjectId(task_id), "user_id": user_id})


def get_all_tasks(user_id):
    tasks = get_tasks_collection()
    data = tasks.find({"user_id": user_id})
    return [task for task in data]


def get_user_by_username(username):
    users = get_users_collection()
    return users.find_one({"username": username})


def add_user(user):
    users = get_users_collection()
    return users.insert_one(user).inserted_id
