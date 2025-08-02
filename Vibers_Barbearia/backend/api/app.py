# app.py

from flask import Flask
from flask_cors import CORS
# A importação de 'enviar_whatsapp' foi removida, mas 'agendamento_bp' é essencial
from agendamentos import agendamento_bp 
from database import get_db_connection
from datetime import date, timedelta
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# --- CORREÇÃO: A linha abaixo foi descomentada ---
# Isso registra todas as rotas de /api/agendamentos, /api/agendamentos/stats, etc.
app.register_blueprint(agendamento_bp, url_prefix="/api")

# A lógica do scheduler para lembretes de WhatsApp continua comentada por enquanto
# def enviar_lembretes_whatsapp():
#     ...

if __name__ == "__main__":
    # O scheduler continua desativado por enquanto
    # scheduler = BackgroundScheduler(daemon=True)
    # scheduler.start()
    
    # Rodando com debug=True para facilitar o desenvolvimento
    app.run(debug=True)
