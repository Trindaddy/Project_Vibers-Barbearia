from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from database import get_db_connection

agendamento_bp = Blueprint('agendamentos', __name__)

def gerar_horarios(inicio_str, fim_str, intervalo_min=15):
    """
    Gera uma lista de horários no formato HH:MM dentro de um intervalo.
    """
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
    """
    Retorna todos os horários disponíveis para uma data e unidade específica.
    """
    try:
        data_obj = datetime.strptime(data, "%Y-%m-%d")
        dia_semana = data_obj.weekday()  # 0=Segunda, ..., 6=Domingo

        # Define expediente baseado no dia da semana
        if 0 <= dia_semana <= 5:  # Segunda a Sábado
            inicio, fim = "08:00", "20:00"
        else:  # Domingo
            inicio, fim = "08:00", "13:00"

        todos = gerar_horarios(inicio, fim, intervalo_min=15)

        agora = datetime.now()
        # Remove horários passados se for o dia atual
        if data_obj.date() == agora.date():
            hora_atual = agora.hour
            minuto_atual = agora.minute
            todos = [
                h for h in todos
                if (int(h.split(":")[0]) > hora_atual) or
                   (int(h.split(":")[0]) == hora_atual and int(h.split(":")[1]) > minuto_atual)
            ]

        # Busca horários ocupados no banco para a data e unidade
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT horario FROM agendamentos WHERE data = %s AND unidade = %s
        """, (data, unidade))

        # CORREÇÃO: O conector do MySQL retorna um objeto 'timedelta' para a coluna TIME.
        # Precisamos formatá-lo manualmente, pois ele não tem o método strftime().
        ocupados = []
        for row in cursor.fetchall():
            horario_td = row["horario"]
            # Calcula horas e minutos a partir dos segundos totais
            horas = int(horario_td.total_seconds() // 3600)
            minutos = int((horario_td.total_seconds() % 3600) // 60)
            ocupados.append(f"{horas:02d}:{minutos:02d}")

        cursor.close()
        conn.close()

        return jsonify({"todos": todos, "ocupados": ocupados})

    except Exception as e:
        print("Erro ao obter horários disponíveis:", e)
        return jsonify({"erro": "Erro ao buscar horários disponíveis"}), 500

@agendamento_bp.route("/agendamentos", methods=["GET"])
def listar_agendamentos():
    """
    Lista todos os agendamentos existentes.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM agendamentos")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        # CORREÇÃO: Converte o objeto 'timedelta' para string antes de serializar
        # para JSON para evitar erros.
        for row in rows:
            if isinstance(row.get("horario"), timedelta):
                horario_td = row["horario"]
                horas = int(horario_td.total_seconds() // 3600)
                minutos = int((horario_td.total_seconds() % 3600) // 60)
                row["horario"] = f"{horas:02d}:{minutos:02d}"

        return jsonify(rows)
    except Exception as e:
        print("Erro ao listar agendamentos:", e)
        return jsonify({"error": "Erro ao listar agendamentos"}), 500

@agendamento_bp.route("/agendamentos", methods=["POST"])
def criar_agendamento():
    """
    Cria um novo agendamento.
    """
    data = request.get_json()

    required_fields = ["nome", "sobrenome", "email", "telefone", "data", "horario", "unidade"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Campos obrigatórios faltando"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verifica se horário já está ocupado
        cursor.execute("""
            SELECT COUNT(*) FROM agendamentos
            WHERE data = %s AND horario = %s AND unidade = %s
        """, (data["data"], data["horario"], int(data["unidade"])))
        (count,) = cursor.fetchone()
        if count > 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Horário já reservado"}), 409

        # Insere agendamento
        sql = """
            INSERT INTO agendamentos (nome, sobrenome, email, telefone, data, horario, unidade)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        valores = (
            data["nome"], data["sobrenome"], data["email"],
            data["telefone"], data["data"], data["horario"], int(data["unidade"])
        )
        cursor.execute(sql, valores)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Agendamento salvo com sucesso"}), 201

    except Exception as e:
        print("Erro ao inserir agendamento:", e)
        return jsonify({"error": "Erro ao salvar o agendamento"}), 500

@agendamento_bp.route("/agendamentos/<int:id>", methods=["DELETE"])
def deletar_agendamento(id):
    """
    Deleta um agendamento com base no ID.
    """
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
