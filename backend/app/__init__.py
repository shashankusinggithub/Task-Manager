from flask import Flask
from flask_pymongo import PyMongo
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config

mongo = PyMongo()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mongo.init_app(app)
    jwt.init_app(app)
    api = Api(app)
    CORS(app)

    from app.routes import initialize_routes
    from app.auth_routes import initialize_auth_routes
    initialize_routes(api)
    initialize_auth_routes(api)

    return app
