# app.py

from flask import Flask
from flask_cors import CORS
from agendamentos import agendamento_bp 
from database import get_db_connection
from datetime import date, timedelta
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

app.register_blueprint(agendamento_bp, url_prefix="/api")

if __name__ == "__main__":
   app.run(debug=True)
