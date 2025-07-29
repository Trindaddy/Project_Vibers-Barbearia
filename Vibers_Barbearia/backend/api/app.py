from flask import Flask
from flask_cors import CORS
from routes.agendamentos import agendamento_bp

app = Flask(__name__)
CORS(app)  # Permite requisições do frontend

# Registrar os blueprints
app.register_blueprint(agendamento_bp)

if __name__ == "__main__":
    app.run(debug=True)
