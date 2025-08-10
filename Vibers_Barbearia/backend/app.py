# app.py
from flask import Flask, send_from_directory
from flask_cors import CORS
from agendamentos import agendamento_bp
from configuracoes import config_bp
from database.database import get_db_connection
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Define a pasta de uploads
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

app.register_blueprint(agendamento_bp, url_prefix="/api")
app.register_blueprint(config_bp, url_prefix="/api")

# --- NOVA ROTA PARA SERVIR AS IMAGENS ---
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True)
