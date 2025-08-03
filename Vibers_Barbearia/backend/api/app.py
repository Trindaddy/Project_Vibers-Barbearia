# app.py
from flask import Flask
from flask_cors import CORS
from agendamentos import agendamento_bp
from configuracoes import config_bp # 1. Importa o novo blueprint
from database import get_db_connection
# ... (outras importações) ...

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.register_blueprint(agendamento_bp, url_prefix="/api")
app.register_blueprint(config_bp, url_prefix="/api") # 2. Registra o novo blueprint

if __name__ == "__main__":
   app.run(debug=True)
