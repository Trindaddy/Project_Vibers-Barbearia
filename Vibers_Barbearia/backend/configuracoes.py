# configuracoes.py
from flask import Blueprint, request, jsonify
from database.database import get_db_connection
import json
import os
from werkzeug.utils import secure_filename

config_bp = Blueprint('configuracoes', __name__)

# Define a pasta onde as logos serão salvas
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'svg'}

# Garante que a pasta de uploads exista
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@config_bp.route("/configuracoes", methods=["GET"])
def obter_configuracoes():
    """Busca todas as configurações do banco de dados."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT chave, valor FROM configuracoes")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        configs = {row['chave']: json.loads(row['valor']) for row in rows}
        return jsonify(configs)
    except Exception as e:
        print(f"Erro ao obter configurações: {e}")
        return jsonify({"error": "Erro ao buscar configurações"}), 500

@config_bp.route("/configuracoes", methods=["POST"])
def salvar_configuracoes():
    """Salva as configurações enviadas pelo painel de admin."""
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        for chave, valor in data.items():
            valor_json = json.dumps(valor)
            sql = "INSERT INTO configuracoes (chave, valor) VALUES (%s, %s) ON DUPLICATE KEY UPDATE valor = VALUES(valor)"
            cursor.execute(sql, (chave, valor_json))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Configurações salvas com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao salvar configurações: {e}")
        return jsonify({"error": "Erro ao salvar configurações"}), 500

# --- NOVA ROTA PARA UPLOAD DA LOGO ---
@config_bp.route('/logo/upload', methods=['POST'])
def upload_logo():
    if 'logo' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400
    
    file = request.files['logo']
    
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # URL que o frontend usará para acessar a imagem
        file_url = f"/uploads/{filename}"
        
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            # Salva a URL no banco de dados
            sql = "INSERT INTO configuracoes (chave, valor) VALUES (%s, %s) ON DUPLICATE KEY UPDATE valor = VALUES(valor)"
            cursor.execute(sql, ('logo_url', json.dumps(file_url)))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Logo salva com sucesso", "logo_url": file_url}), 200
        except Exception as e:
            print(f"Erro ao salvar URL da logo no banco: {e}")
            return jsonify({"error": "Erro ao salvar a logo"}), 500
            
    return jsonify({"error": "Tipo de arquivo não permitido"}), 400
