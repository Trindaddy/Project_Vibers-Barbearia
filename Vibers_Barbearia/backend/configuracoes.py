# configuracoes.py
from flask import Blueprint, request, jsonify
# --- CORREÇÃO: Importação correta do pacote 'database' ---
from database.database import get_db_connection
import json

config_bp = Blueprint('configuracoes', __name__)

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
        configs = {row['chave']: row['valor'] for row in rows}
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
# configuracoes.py
from flask import Blueprint, request, jsonify
# --- CORREÇÃO: Importação correta do pacote 'database' ---
from database.database import get_db_connection
import json

config_bp = Blueprint('configuracoes', __name__)

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
        configs = {row['chave']: row['valor'] for row in rows}
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
