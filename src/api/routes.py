"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Score
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

# Traer todos los usuarios
@api.route("/users", methods=["GET"])
def users_list():    
    users = User.query.all()
    all_users = list(map(lambda x: x.serialize(), users))  # Convertir los objetos SQLAlchemy a diccionarios
    return jsonify(all_users), 200  # Responder con JSON y código 200

# Obtener un usuario por ID
@api.route("/users/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.get(id)  # Obtener el usuario por su ID
    if user is None:  # Validar si existe
        return jsonify({"error": "User not found"}), 404  # Responder con un error 404 si no se encuentra
    return jsonify(user.serialize()), 200  # Responder con JSON serializado y código 200

# Registro de Iniciar Sesion

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
    return jsonify({
        "access_token": access_token,
        "msg": "Login exitoso",
        "user_name": user.name,  # <-- Incluye el nombre del usuario
        "user_id": user.id
    }), 200

# Registrar jugador
@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json()

    # Verificar si falta algún campo
    if not all(key in body for key in ["name", "lastname", "email", "password"]):
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
        email=body["email"],
        password=hashed_password,
        is_active=True,
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201

#Tabla de Puntuacion

@api.route('/score', methods=['GET'])
def get_latest_scores():
    """Obtener el puntaje más reciente registrado para cada usuario."""
    try:
        # Consulta para obtener el ID del puntaje más reciente por usuario
        subquery = db.session.query(
            Score.user_id,
            db.func.max(Score.id).label('max_id')  # ID del puntaje más reciente
        ).group_by(Score.user_id).subquery()

        # Obtener los registros completos del puntaje más reciente
        recent_scores = db.session.query(Score).join(
            subquery, Score.id == subquery.c.max_id
        ).order_by(Score.score.desc()).all()  # Ordenar por puntuación descendente

        # Serializar y agregar posición
        result = []
        for index, score in enumerate(recent_scores):
            serialized_score = score.serialize()
            serialized_score['position'] = index + 1
            result.append(serialized_score)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"msg": "Error al obtener puntuaciones", "error": str(e)}), 500




@api.route('/score', methods=['POST'])
def add_score():
    """Registrar un nuevo puntaje sin importar si es mayor o menor."""
    data = request.json

   # Valida que todos los campos requeridos estén presentes.
    required_fields = ['user_id', 'name', 'score', 'time', 'level']
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Datos incompletos"}), 400

    try:
        #Verifica si ya existe un puntaje registrado para ese usuario.
        existing_score = Score.query.filter_by(user_id=data['user_id']).first()

        #Si el nuevo puntaje es mayor, actualiza el registro existente. Devuelve el puntaje actualizado.
        if existing_score:
             existing_score.name = data['name']
             existing_score.score = data['score']
             existing_score.time = data['time']
             existing_score.level = data['level']
             db.session.commit()
             return jsonify({"msg": "Puntuación actualizada", "score": existing_score.serialize()}), 200
                   
        else: #Si no hay puntaje previo, crea un nuevo registro.
            new_score = Score(
                user_id=data['user_id'],
                name=data['name'],
                score=data['score'],
                time=data['time'],
                level=data['level']
            )
            db.session.add(new_score)
            db.session.commit()
            return jsonify({"msg": "Puntuación registrada", "score": new_score.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al guardar la puntuación", "error": str(e)}), 500


    
#Private Pagina
@api.route("/demo", methods=["GET"])  
@jwt_required()
def demo():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
