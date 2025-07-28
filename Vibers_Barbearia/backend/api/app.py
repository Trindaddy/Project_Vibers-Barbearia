from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import mysql.connector

# Carrega variáveis do .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Pega as variáveis do .env
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Conexão com o banco de dados
db = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)

@app.route("/agendar", methods=["POST"])
def agendar():
    data = request.get_json()

    try:
        nome = data["nome"]
        sobrenome = data["sobrenome"]
        email = data["email"]
        telefone = data["telefone"]
        data_agendamento = data["data"]
        horario = data["horario"]
        unidade = data["unidade"]

        cursor = db.cursor()
        sql = """
            INSERT INTO agendamentos
            (nome, sobrenome, email, telefone, data, horario, unidade)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        unidade_formatada = (
            "Unidade 1 - EQNP" if unidade == "1" else "Unidade 2 - QNP"
        )

        cursor.execute(sql, (
            nome, sobrenome, email, telefone,
            data_agendamento, horario, unidade_formatada
        ))
        db.commit()
        cursor.close()

        return jsonify({"message": "Agendamento salvo com sucesso"}), 201

    except Exception as e:
        print("Erro ao inserir no banco:", e)
        return jsonify({"error": "Erro ao salvar o agendamento"}), 500

if __name__ == "__main__":
    app.run(debug=True)
