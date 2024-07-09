from flask import request
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.models import get_user_by_username, add_user


class Register(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if get_user_by_username(username):
            return {"message": "User already exists"}, 400

        hashed_password = generate_password_hash(password)
        user_id = add_user({"username": username, "password": hashed_password})

        return {"user_id": str(user_id)}, 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        user = get_user_by_username(username)

        if not user or not check_password_hash(user["password"], password):
            return {"message": "Invalid credentials"}, 401

        access_token = create_access_token(identity=str(user["_id"]))
        return {"access_token": access_token}, 200


def initialize_auth_routes(api):
    api.add_resource(Register, '/api/auth/register')
    api.add_resource(Login, '/api/auth/login')
