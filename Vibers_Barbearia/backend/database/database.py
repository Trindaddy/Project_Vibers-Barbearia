# database/database.py
import os

import mysql.connector
from dotenv import load_dotenv
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor, MySQLCursorDict

# --- CORREÇÃO: Garante que as variáveis de ambiente são sempre carregadas ---
load_dotenv()


def get_db_connection() -> MySQLConnection | None:
    """Cria e retorna uma nova conexão com o banco de dados."""
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            charset="utf8mb4",
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Erro de conexão com o banco de dados: {err}")
        return None


def get_cursor(conn: MySQLConnection) -> MySQLCursor:
    """Retorna um cursor padrão com fallback seguro."""
    return conn.cursor() if conn else None


def get_dict_cursor(conn: MySQLConnection) -> MySQLCursorDict:
    """Retorna um cursor que devolve dicionários (útil para JSON)."""
    return conn.cursor(dictionary=True) if conn else None
