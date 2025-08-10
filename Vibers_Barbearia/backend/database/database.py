# database/database.py
import mysql.connector
import os
from dotenv import load_dotenv

# --- CORREÇÃO: Garante que as variáveis de ambiente são sempre carregadas ---
load_dotenv()

def get_db_connection():
    """Cria e retorna uma nova conexão com o banco de dados."""
    try:
        # Adicionado um print para depuração, para vermos quais credenciais estão a ser usadas
        print(f"A tentar ligar com o utilizador: {os.getenv('DB_USER')}")
        
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        print("Ligação à base de dados bem-sucedida!")
        return conn
    except mysql.connector.Error as err:
        print(f"Erro de conexão com o banco de dados: {err}")
        return None
