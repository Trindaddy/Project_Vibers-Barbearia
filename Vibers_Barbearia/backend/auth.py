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

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({"message": "Usuário ou senha inválidos"}), 401

    token = jwt.encode({
        'user_id': user['id'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(hours=8)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token})

# Rota de utilidade para criar um novo usuário (use com cuidado)
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"message": "Dados para registro incompletos"}), 400
    
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256:600000')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO usuarios (username, password_hash) VALUES (%s, %s)", (data['username'], hashed_password))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Usuário registrado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"message": f"Erro ao registrar usuário: {e}"}), 500
