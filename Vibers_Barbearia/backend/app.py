# app.py
from flask import Flask, send_from_directory
from flask_cors import CORS
import os

# A chamada a load_dotenv() foi removida daqui, pois agora está no database.py
from agendamentos import agendamento_bp
from configuracoes import config_bp
from auth import auth_bp
from database.database import get_db_connection

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-fallback-secret-key')
CORS(app, origins=["http://localhost:5173"])

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

app.register_blueprint(agendamento_bp, url_prefix="/api")
app.register_blueprint(config_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True)
