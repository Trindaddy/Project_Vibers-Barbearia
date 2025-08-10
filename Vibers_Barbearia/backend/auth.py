# auth.py
from flask import Blueprint, request, jsonify
from database.database import get_db_connection
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
import os
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv('SECRET_KEY', 'default-fallback-secret-key')

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Credenciais incompletas"}), 400

    username = data['username']
    password = data['password']
    
    # --- INÍCIO DO DIAGNÓSTICO ---
    print("\n--- TENTATIVA DE LOGIN ---")
    print(f"Recebido - Utilizador: '{username}', Palavra-passe: '{password}'")

    conn = get_db_connection()
    if not conn:
        print("FALHA: Não foi possível conectar à base de dados.")
        return jsonify({"message": "Erro interno do servidor"}), 500
        
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        print(f"FALHA: Utilizador '{username}' não encontrado na base de dados.")
        return jsonify({"message": "Utilizador ou palavra-passe inválidos"}), 401
    
    print(f"SUCESSO: Utilizador '{username}' encontrado.")
    print(f"Hash da BD: {user['password_hash']}")
    
    is_password_correct = check_password_hash(user['password_hash'], password)
    
    if not is_password_correct:
        print("FALHA: A verificação da palavra-passe (check_password_hash) retornou FALSO.")
        return jsonify({"message": "Utilizador ou palavra-passe inválidos"}), 401
    
    print("SUCESSO: A verificação da palavra-passe retornou VERDADEIRO.")
    # --- FIM DO DIAGNÓSTICO ---

    token = jwt.encode({
        'user_id': user['id'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(hours=8)
    }, SECRET_KEY, algorithm="HS256")

    print("SUCESSO: Token JWT gerado. Login bem-sucedido!")
    return jsonify({"token": token})

# Rota de utilidade para criar um novo usuário (use com cuidado)
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Dados para registo incompletos"}), 400
    
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256:600000')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO usuarios (username, password_hash) VALUES (%s, %s)", (data['username'], hashed_password))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Utilizador registado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"message": f"Erro ao registar utilizador: {e}"}), 500
