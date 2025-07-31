from flask import Flask
from flask_cors import CORS
from agendamentos import agendamento_bp  

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.register_blueprint(agendamento_bp)

if __name__ == "__main__":
    app.run(debug=True)