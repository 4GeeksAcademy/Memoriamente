"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_mail import Mail, Message #RESTABLECER CONTRASEÑA
from datetime import timedelta  #TIEMPO PARA RESTABLECER CONTRASEÑA
from werkzeug.security import generate_password_hash  # Importa para generar hash

from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.models import User 
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager 




# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Allow CORS requests to this API
CORS(app)

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'memoriamentegame@gmail.com'
app.config['MAIL_PASSWORD'] = 'gval wrva xmld hvzc'

mail = Mail(app)

@app.route('/forgot-password', methods=['POST']) #olvido contraseña
def forgot_password():
    email=request.json.get('email')
    user= User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg":"Email not found"}), 404
    
     # Generar un token de acceso con una expiración de 5 minutos
    token=create_access_token(identity=user.id,expires_delta=timedelta(minutes=20)) 


     # Crear el contenido del correo electrónico
    template_html = f"""
    <html>
        <body>
            <h1>Restablece tu contraseña</h1>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="https://improved-space-fortnight-7vv9rvwq6x9gfpx4-3000.app.github.dev/reset-password?token={token}">Restablecer contraseña</a>
        </body>
    </html>
    """
    # Enviar el correo
    msg = Message(
        "Restablecimiento de contraseña",
        sender="memoriamentegame@gmail.com",  # Usa un correo válido
        recipients=[user.email],
        html=template_html
    )
    mail.send(msg)

    return jsonify({"msg": "Correo enviado"}), 200

@app.route('/reset-password', methods=['POST'])  # Restablecer contraseña
@jwt_required()
def reset_password():
    user_id = get_jwt_identity()  # Obtener el ID del usuario del token JWT
    password = request.json.get('password')

    # Verificar que se proporcionó la contraseña
    if not password:
        return jsonify({"msg": "Se requiere una nueva contraseña"}), 400

    user = User.query.get(user_id)  # Buscar al usuario por ID

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # Generar el hash de la nueva contraseña y guardarlo
    user.password = generate_password_hash(password)
    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada"}), 200

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({
            "id": user.id,
            "name": user.name,
            "lastname": user.lastname,
            "email": user.email,
        }), 200
    return jsonify({"msg": "Usuario no encontrado"}), 404

@app.route('/api/user', methods=['PUT'])
@jwt_required()
def edit_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    body = request.get_json()
    user.name = body.get("name", user.name)
    user.lastname = body.get("lastname", user.lastname)
    user.email = body.get("email", user.email)

    db.session.commit()
    return jsonify({
        "id": user.id,
        "name": user.name,
        "lastname": user.lastname,
        "email": user.email,
    }), 200

@app.route('/api/user', methods=['DELETE'])
@jwt_required()
def delete_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Usuario eliminado correctamente"}), 200





# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)



# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "Leones del caracas Campeones"  # Change this!
jwt = JWTManager(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
