from datetime import date, datetime, timedelta
from functools import wraps
import json
import os

from flask import Blueprint, jsonify, request
import jwt

from database import get_db_connection

SECRET_KEY = os.getenv("SECRET_KEY", "default-fallback-secret-key")
agendamento_bp = Blueprint("agendamentos", __name__)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({"message": "Token de acesso em falta!"}), 401
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except Exception as e:  # pragma: no cover - tratamos mensagem direta
            return jsonify({"message": f"Token inválido ou expirado: {e}"}), 401
        return f(*args, **kwargs)

    return decorated


def gerar_horarios(inicio_str, fim_str, intervalo_min=15):
    """Gera uma lista de horários no formato HH:MM dentro de um intervalo."""
    horarios = []
    hora, minuto = map(int, inicio_str.split(":"))
    fim_hora, fim_minuto = map(int, fim_str.split(":"))

    atual = datetime(2000, 1, 1, hora, minuto)
    fim = datetime(2000, 1, 1, fim_hora, fim_minuto)

    while atual <= fim:
        horarios.append(atual.strftime("%H:%M"))
        atual += timedelta(minutes=intervalo_min)

    return horarios


@agendamento_bp.route("/horarios-disponiveis/<data>/<int:unidade>", methods=["GET"])
def horarios_disponiveis(data, unidade):
    """Retorna todos os horários disponíveis, respeitando configurações e bloqueios."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT chave, valor FROM configuracoes")
        configs_raw = cursor.fetchall()
        configs = {row["chave"]: row["valor"] for row in configs_raw}

        horarios_config = json.loads(configs.get("horarios", "{}"))
        datas_bloqueadas = json.loads(configs.get("datas_bloqueadas", "[]"))

        if data in datas_bloqueadas:
            cursor.close()
            conn.close()
            return jsonify({"todos": [], "ocupados": []})

        data_obj = datetime.strptime(data, "%Y-%m-%d")
        dia_semana = data_obj.weekday()

        default_horarios = {
            "semana": {"inicio": "08:00", "fim": "20:00"},
            "sabado": {"inicio": "08:00", "fim": "13:00"},
        }

        if 0 <= dia_semana <= 4:
            horarios_dia = default_horarios["semana"].copy()
            config_semana = horarios_config.get("semana", {})
            if isinstance(config_semana, dict):
                horarios_dia.update(config_semana)
        else:
            horarios_dia = default_horarios["sabado"].copy()
            config_sabado = horarios_config.get("sabado", {})
            if isinstance(config_sabado, dict):
                horarios_dia.update(config_sabado)

        inicio = horarios_dia.get("inicio")
        fim = horarios_dia.get("fim")
        if not inicio or not fim:
            cursor.close()
            conn.close()
            return jsonify({"todos": [], "ocupados": []})

        todos = gerar_horarios(inicio, fim, intervalo_min=15)

        agora = datetime.now()
        if data_obj.date() == agora.date():
            hora_atual = agora.hour
            minuto_atual = agora.minute
            todos = [
                h
                for h in todos
                if (int(h.split(":")[0]) > hora_atual)
                or (
                    int(h.split(":")[0]) == hora_atual
                    and int(h.split(":")[1]) > minuto_atual
                )
            ]

        cursor.execute(
            "SELECT horario FROM agendamentos WHERE data = %s AND unidade = %s AND status != 'cancelado'",
            (data, unidade),
        )

        ocupados = []
        for row in cursor.fetchall():
            horario_td = row["horario"]
            horas = int(horario_td.total_seconds() // 3600)
            minutos = int((horario_td.total_seconds() % 3600) // 60)
            ocupados.append(f"{horas:02d}:{minutos:02d}")

        cursor.close()
        conn.close()

        return jsonify({"todos": todos, "ocupados": ocupados})
    except Exception as e:
        print("Erro ao obter horários disponíveis:", e)
        return jsonify({"erro": "Erro ao buscar horários disponíveis"}), 500


@agendamento_bp.route("/agendamentos", methods=["POST"])
def criar_agendamento():
    data = request.get_json()

    required_fields = [
        "nome",
        "sobrenome",
        "email",
        "telefone",
        "data",
        "horario",
        "unidade",
    ]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Campos obrigatórios faltando"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT COUNT(*) FROM agendamentos
            WHERE data = %s AND horario = %s AND unidade = %s AND status != 'cancelado'
        """,
            (data["data"], data["horario"], int(data["unidade"])),
        )
        (count,) = cursor.fetchone()
        if count > 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Horário já reservado"}), 409

        sql = """
            INSERT INTO agendamentos (nome, sobrenome, email, telefone, data, horario, unidade, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        valores = (
            data["nome"],
            data["sobrenome"],
            data["email"],
            data["telefone"],
            data["data"],
            data["horario"],
            int(data["unidade"]),
            "pendente",
        )
        cursor.execute(sql, valores)
        conn.commit()

        cursor.close()
        conn.close()
        return jsonify({"message": "Agendamento salvo com sucesso"}), 201

    except Exception as e:
        print("Erro ao inserir agendamento:", e)
        return jsonify({"error": "Erro ao salvar o agendamento"}), 500


@agendamento_bp.route("/agendamentos", methods=["GET"])
@token_required
def listar_agendamentos():
    filtro_status = request.args.get("status", "pendente")
    search_term = request.args.get("search", "")
    start_date = request.args.get("start_date", "")
    end_date = request.args.get("end_date", "")

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM agendamentos"
        params = []
        where_clauses = []

        if filtro_status != "todos":
            where_clauses.append("status = %s")
            params.append(filtro_status)

        if search_term:
            where_clauses.append("(nome LIKE %s OR sobrenome LIKE %s)")
            params.append(f"%{search_term}%")
            params.append(f"%{search_term}%")

        if start_date:
            where_clauses.append("data >= %s")
            params.append(start_date)
        if end_date:
            where_clauses.append("data <= %s")
            params.append(end_date)

        if where_clauses:
            query += " WHERE " + " AND ".join(where_clauses)

        query += " ORDER BY data ASC, horario ASC"

        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()

        for row in rows:
            data_obj = row.get("data")
            if isinstance(data_obj, (datetime, date)):
                row["data"] = data_obj.strftime("%Y-%m-%d")

            if isinstance(row.get("horario"), timedelta):
                horario_td = row["horario"]
                horas = int(horario_td.total_seconds() // 3600)
                minutos = int((horario_td.total_seconds() % 3600) // 60)
                row["horario"] = f"{horas:02d}:{minutos:02d}"

        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        print("Erro ao listar agendamentos:", e)
        return jsonify({"error": "Erro ao listar agendamentos"}), 500


@agendamento_bp.route("/agendamentos/next", methods=["GET"])
@token_required
def proximo_agendamento():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT nome, sobrenome, horario 
            FROM agendamentos 
            WHERE data = CURDATE() AND status = 'pendente' AND horario > CURTIME()
            ORDER BY horario ASC 
            LIMIT 1
        """
        cursor.execute(query)
        proximo = cursor.fetchone()

        if proximo and isinstance(proximo.get("horario"), timedelta):
            horario_td = proximo["horario"]
            horas = int(horario_td.total_seconds() // 3600)
            minutos = int((horario_td.total_seconds() % 3600) // 60)
            proximo["horario"] = f"{horas:02d}:{minutos:02d}"

        cursor.close()
        conn.close()
        return jsonify(proximo if proximo else {})
    except Exception as e:
        print(f"Erro ao buscar próximo cliente: {e}")
        return jsonify({"error": "Erro ao buscar próximo cliente"}), 500


@agendamento_bp.route("/agendamentos/<int:id>", methods=["DELETE"])
@token_required
def deletar_agendamento(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM agendamentos WHERE id = %s", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Agendamento excluído com sucesso"}), 200
    except Exception as e:
        print("Erro ao excluir agendamento:", e)
        return jsonify({"error": "Erro ao excluir o agendamento"}), 500


@agendamento_bp.route("/agendamentos/<int:id>/status", methods=["PATCH"])
@token_required
def atualizar_status(id):
    novo_status = request.json.get("status")
    if novo_status not in ["pendente", "confirmado", "concluido", "cancelado"]:
        return jsonify({"error": "Status inválido"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE agendamentos SET status = %s WHERE id = %s", (novo_status, id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensagem": "Status atualizado com sucesso"})
    except Exception as e:
        print("Erro ao atualizar status:", e)
        return jsonify({"error": "Erro ao atualizar status"}), 500


@agendamento_bp.route("/agendamentos/stats", methods=["GET"])
@token_required
def agendamento_stats():
    start_date = request.args.get("start_date", "")
    end_date = request.args.get("end_date", "")

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query_status = "SELECT status, COUNT(id) as total FROM agendamentos"
        params = []
        where_clauses = []

        if start_date:
            where_clauses.append("data >= %s")
            params.append(start_date)
        if end_date:
            where_clauses.append("data <= %s")
            params.append(end_date)

        if where_clauses:
            query_status += " WHERE " + " AND ".join(where_clauses)

        query_status += " GROUP BY status"

        cursor.execute(query_status, tuple(params))
        stats_status = cursor.fetchall()

        query_hoje = "SELECT COUNT(id) as total FROM agendamentos WHERE data = CURDATE()"
        cursor.execute(query_hoje)
        stats_hoje = cursor.fetchone()

        cursor.close()
        conn.close()

        stats = {status["status"]: status["total"] for status in stats_status}
        for s in ["pendente", "concluido", "cancelado"]:
            if s not in stats:
                stats[s] = 0
        stats["hoje"] = stats_hoje["total"] if stats_hoje else 0

        return jsonify(stats)
    except Exception as e:
        print(f"Erro ao buscar stats: {e}")
        return jsonify({"error": "Erro ao buscar estatísticas"}), 500
