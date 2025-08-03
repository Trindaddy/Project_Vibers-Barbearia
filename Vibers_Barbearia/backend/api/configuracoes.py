# configuracoes.py
from flask import Blueprint, request, jsonify
from database import get_db_connection
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

        # Transforma a lista de rows em um dicionário mais fácil de usar no frontend
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

        # Itera sobre cada configuração recebida (horarios, datas_bloqueadas, etc.)
        for chave, valor in data.items():
            # Converte o dicionário/lista Python para uma string JSON para salvar no DB
            valor_json = json.dumps(valor)
            
            # O comando 'ON DUPLICATE KEY UPDATE' insere se não existir, ou atualiza se já existir.
            sql = """
                INSERT INTO configuracoes (chave, valor)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE valor = VALUES(valor)
            """
            cursor.execute(sql, (chave, valor_json))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Configurações salvas com sucesso"}), 200
    except Exception as e:
        print(f"Erro ao salvar configurações: {e}")
        return jsonify({"error": "Erro ao salvar configurações"}), 500
