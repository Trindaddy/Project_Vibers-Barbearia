from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database.database import get_db_connection, get_dict_cursor

# Carrega as variáveis de ambiente no início de tudo
load_dotenv()

from agendamentos import agendamento_bp
from configuracoes import config_bp
from auth import auth_bp

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-fallback-secret-key')

# --- CORS ---
# Em produção, você pode querer ser mais restritivo
CORS(app)

# Pasta de uploads
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Blueprints ---
app.register_blueprint(agendamento_bp, url_prefix="/api")
app.register_blueprint(config_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")

# --- Rota Pública para Listar Barbearias (Para a Home Page) ---
@app.route('/api/barbearias', methods=['GET'])
def listar_barbearias():
    conn = get_db_connection()
    if not conn: return jsonify({"erro": "Erro de conexão"}), 500
    try:
        cursor = get_dict_cursor(conn)
        cursor.execute("SELECT id, nome, slug, modelo_agendamento FROM barbearias")
        barbearias = cursor.fetchall()
        return jsonify([dict(b) for b in barbearias])
    finally:
        conn.close()

# --- Rota para Criar Nova Barbearia (Cadastro) ---
@app.route('/api/barbearias', methods=['POST'])
def criar_barbearia():
    data = request.get_json()
    # Aqui você adicionaria validação e lógica de criação
    # Incluindo criar o usuário 'dono' associado
    return jsonify({"message": "Funcionalidade em desenvolvimento"}), 201

# Rota para servir arquivos de upload
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True)