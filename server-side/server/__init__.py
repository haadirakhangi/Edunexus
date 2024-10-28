from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from server.config import Config
from flask_cors import CORS
from flask_migrate import Migrate
from models.teacher_schema import Teacher,Lesson, db, bcrypt,Course,LabManual

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)
    app.json.sort_keys = False
    CORS(app, supports_credentials=True)

    db.init_app(app)
    bcrypt.init_app(app)
    migrate = Migrate(app, db)

    from server.teacher.routes import teachers
    app.register_blueprint(teachers)
    return app
