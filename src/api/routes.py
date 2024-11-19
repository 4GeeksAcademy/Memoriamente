"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash


from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__) 

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    # Verificar que se proporcionaron los campos
    if not email or not password:
        return jsonify({"msg": "Faltan datos"}), 400

    # Buscar al usuario por email
    user = User.query.filter_by(email=email).first()

    # Validar si el usuario existe y la contraseña es correcta
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401

    # Crear el token
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, msg="Login exitoso"), 200


@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json()

    # Verificar si falta algún campo
    if not all(key in body for key in ["name", "lastname", "seudonimo", "email", "password"]):
        return jsonify({"msg": "Faltan datos en el registro"}), 400

    # Verificar si ya existe un usuario con el mismo email
    user = User.query.filter_by(email=body["email"]).first()
    if user:
        return jsonify({"msg": "Ya existe un usuario con ese correo"}), 401

    # Cifrar la contraseña
    hashed_password = generate_password_hash(body["password"])

    # Crear el nuevo usuario
    user = User(
        name=body["name"],
        lastname=body["lastname"],
        seudonimo=body["seudonimo"],
        email=body["email"],
        password=hashed_password,
        is_active=True,
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201



    
#Private Pagina
@api.route("/demo", methods=["GET"])
@jwt_required()
def demo():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
