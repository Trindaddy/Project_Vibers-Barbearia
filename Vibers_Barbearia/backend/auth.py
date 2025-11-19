from flask import Blueprint, request, jsonify
from database.database import get_db_connection, get_dict_cursor
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
import os
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv('SECRET_KEY', 'default-fallback-secret-key')

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'): # Mudou de username para email
        return jsonify({"message": "Credenciais incompletas"}), 400

    email = data['email']
    password = data['password']

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Erro de conexão com o banco"}), 500
        
    try:
        cursor = get_dict_cursor(conn)
        # Agora buscamos também o barbearia_id e o tipo
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({"message": "Usuário ou senha inválidos"}), 401

        token = jwt.encode({
            'user_id': user['id'],
            'role': user['tipo'], # 'admin_geral', 'dono', 'cliente'
            'barbearia_id': user['barbearia_id'], # Importante para o contexto
            'exp': datetime.utcnow() + timedelta(hours=8)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "token": token, 
            "role": user['tipo'],
            "barbearia_id": user['barbearia_id'],
            "nome": user['nome']
        })
    except Exception as e:
        print(f"Erro no login: {e}")
        return jsonify({"message": "Erro interno do servidor"}), 500
    finally:
        if conn:
            conn.close()

# ... (Rota de registro precisa ser atualizada para suportar cadastro de barbearia + dono)