from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()


from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    CORS(app, origins="*", allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    db.init_app(app)

    jwt = JWTManager(app)

    from app.routes.user_routes import user_bp
    app.register_blueprint(user_bp)

    return app