import os


class Config:
    MONGO_URI = os.getenv(
        'DATABASE_URL', 'mongodb://localhost:27017/taskmanager')
    SECRET_KEY = os.getenv('SECRET_KEY', 'rinkuj')
