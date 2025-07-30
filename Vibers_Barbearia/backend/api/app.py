from flask import Flask
from flask_cors import CORS
from agendamentos import agendamento_bp  

app = Flask(__name__)
CORS(app)

# Registrar os blueprints
app.register_blueprint(agendamento_bp)

if __name__ == "__main__":
    app.run(debug=True)
