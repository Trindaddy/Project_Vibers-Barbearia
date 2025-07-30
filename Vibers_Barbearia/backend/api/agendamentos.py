from flask import Blueprint, request, jsonify
from database import get_db_connection  

agendamento_bp = Blueprint('agendamentos', __name__)

@agendamento_bp.route("/agendamentos", methods=["GET"])
def listar_agendamentos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM agendamentos")
    rows = cursor.fetchall()
    conn.close()

    agendamentos = [
        {
            "id": row["id"],
            "nome": row["nome"],
            "sobrenome": row["sobrenome"],
            "email": row["email"],
            "telefone": row["telefone"],
            "data": row["data"],
            "horario": row["horario"],
            "unidade": row["unidade"]
        }
        for row in rows
    ]

    return jsonify(agendamentos)

@agendamento_bp.route("/agendamentos", methods=["POST"])
def criar_agendamento():
    data = request.get_json()
    try:
        db = get_db_connection()
        cursor = db.cursor()
        sql = """
            INSERT INTO agendamentos (nome, sobrenome, email, telefone, data, horario, unidade)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        unidade_formatada = (
            "Unidade 1 - EQNP" if data["unidade"] == "1" else "Unidade 2 - QNP"
        )
        valores = (
            data["nome"], data["sobrenome"], data["email"],
            data["telefone"], data["data"], data["horario"], unidade_formatada
        )
        cursor.execute(sql, valores)
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Agendamento salvo com sucesso"}), 201
    except Exception as e:
        print("Erro ao inserir agendamento:", e)
        return jsonify({"error": "Erro ao salvar o agendamento"}), 500

@agendamento_bp.route("/agendamentos/<int:id>", methods=["DELETE"])
def deletar_agendamento(id):
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("DELETE FROM agendamentos WHERE id = %s", (id,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"message": "Agendamento excluído com sucesso"}), 200
    except Exception as e:
        print("Erro ao excluir:", e)
        return jsonify({"error": "Erro ao excluir o agendamento"}), 500
