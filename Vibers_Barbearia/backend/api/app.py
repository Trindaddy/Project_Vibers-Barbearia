from flask import Flask
from flask_cors import CORS
from agendamentos import agendamento_bp  

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # ou CORS(app) para liberar todas origens

app.register_blueprint(agendamento_bp, url_prefix="/api")  # Prefixo importante para o fetch do frontend

if __name__ == "__main__":
    app.run(debug=True)