from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from server.config import Config
from flask_cors import CORS
from flask_migrate import Migrate
from server.routes import users

db = SQLAlchemy()
bcrypt = Bcrypt()

app = Flask(__name__)

app.config.from_object(Config)
app.json.sort_keys = False
CORS(app, supports_credentials=True)

db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(users)

# with app.app_context():
#     from server import db
#     db.create_all()

if __name__=="__main__":
    app.run(debug=True,port=5000)