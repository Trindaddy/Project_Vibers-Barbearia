# configuracoes.py
import json
import os
from functools import wraps

from flask import Blueprint, jsonify, request
import jwt
from werkzeug.utils import secure_filename

from database import get_db_connection

SECRET_KEY = os.getenv("SECRET_KEY", "default-fallback-secret-key")
config_bp = Blueprint("configuracoes", __name__)

# Define a pasta onde as logos serão salvas
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "svg"}

# Garante que a pasta de uploads exista
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({"message": "Token de acesso faltando!"}), 401
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception as e:  # pragma: no cover - mensagem direta
            return jsonify({"message": f"Token inválido ou expirado: {e}"}), 401
        return f(*args, **kwargs)

    return decorated


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@config_bp.route("/configuracoes/public", methods=["GET"])
def obter_configuracoes_publicas():
    """Busca apenas as configurações públicas, como a URL da logo."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT chave, valor FROM configuracoes WHERE chave = 'logo_url'")
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        configs = {}
        if row:
            configs[row["chave"]] = json.loads(row["valor"])

        return jsonify(configs)
    except Exception as e:
        print(f"Erro ao obter configurações públicas: {e}")
        return jsonify({"error": "Erro ao buscar configurações públicas"}), 500


@config_bp.route("/configuracoes", methods=["GET"])
@token_required
def obter_configuracoes_privadas():
    """Busca todas as configurações para o painel de admin."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT chave, valor FROM configuracoes")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        configs = {row["chave"]: json.loads(row["valor"]) for row in rows}
        return jsonify(configs)
    except Exception as e:
        print(f"Erro ao obter configurações: {e}")
        return jsonify({"error": "Erro ao buscar configurações"}), 500


@config_bp.route("/configuracoes", methods=["POST"])
@token_required
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


@config_bp.route("/logo/upload", methods=["POST"])
@token_required
def upload_logo():
    if "logo" not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400

    file = request.files["logo"]

    if file.filename == "":
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        file_url = f"/uploads/{filename}"

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            sql = "INSERT INTO configuracoes (chave, valor) VALUES (%s, %s) ON DUPLICATE KEY UPDATE valor = VALUES(valor)"
            cursor.execute(sql, ("logo_url", json.dumps(file_url)))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Logo salva com sucesso", "logo_url": file_url}), 200
        except Exception as e:
            print(f"Erro ao salvar URL da logo no banco: {e}")
            return jsonify({"error": "Erro ao salvar a logo"}), 500

    return jsonify({"error": "Tipo de arquivo não permitido"}), 400
