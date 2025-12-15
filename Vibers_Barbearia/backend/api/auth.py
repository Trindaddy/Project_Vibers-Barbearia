import os
from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
import jwt
from werkzeug.security import check_password_hash, generate_password_hash

from database import get_db_connection, get_dict_cursor

auth_bp = Blueprint("auth", __name__)

SECRET_KEY = os.getenv("SECRET_KEY", "default-fallback-secret-key")


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Credenciais incompletas"}), 400

    email = data["email"]
    password = data["password"]

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Erro de conexão com o banco"}), 500

    try:
        cursor = get_dict_cursor(conn)
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user or not check_password_hash(user["password_hash"], password):
            return jsonify({"message": "Usuário ou senha inválidos"}), 401

        token = jwt.encode(
            {
                "user_id": user["id"],
                "role": user["tipo"],
                "barbearia_id": user["barbearia_id"],
                "exp": datetime.utcnow() + timedelta(hours=8),
            },
            SECRET_KEY,
            algorithm="HS256",
        )

        return jsonify(
            {
                "token": token,
                "role": user["tipo"],
                "barbearia_id": user["barbearia_id"],
                "nome": user["nome"],
            }
        )
    except Exception as e:
        print(f"Erro no login: {e}")
        return jsonify({"message": "Erro interno do servidor"}), 500
    finally:
        if conn:
            conn.close()


@auth_bp.route("/usuarios", methods=["POST"])
def register_user():
    """Cria um usuário básico (admin_geral por padrão)."""
    data = request.get_json()
    required = ["nome", "email", "password"]
    if not all(data.get(field) for field in required):
        return jsonify({"message": "Dados incompletos"}), 400

    hashed = generate_password_hash(data["password"], method="pbkdf2:sha256:600000")

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Erro de conexão com o banco"}), 500

    try:
        cursor = conn.cursor()
        sql = """
            INSERT INTO usuarios (nome, email, password_hash, tipo)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), tipo = VALUES(tipo)
        """
        cursor.execute(sql, (data["nome"], data["email"], hashed, data.get("tipo", "admin_geral")))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Usuário criado/atualizado com sucesso"}), 201
    except Exception as e:
        print(f"Erro ao criar usuário: {e}")
        return jsonify({"message": "Erro ao criar usuário"}), 500

