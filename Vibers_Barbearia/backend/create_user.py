# create_user.py
import sys
from getpass import getpass
from werkzeug.security import generate_password_hash
from database import get_db_connection

def create_user():
    """
    Script de linha de comando para criar ou atualizar um utilizador na base de dados.
    """
    if len(sys.argv) != 2:
        print("Uso: python create_user.py <username>")
        return

    username = sys.argv[1]
    password = getpass(f"Digite a palavra-passe para o utilizador '{username}': ")
    password_confirm = getpass("Confirme a palavra-passe: ")

    if password != password_confirm:
        print("As palavras-passe não coincidem. Operação cancelada.")
        return

    # Gera o hash usando o mesmo método da sua aplicação
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256:600000')

    try:
        conn = get_db_connection()
        if not conn:
            print("Não foi possível conectar à base de dados.")
            return
            
        cursor = conn.cursor()
        
        # Usa REPLACE INTO para inserir um novo utilizador ou atualizar um existente
        sql = """
            REPLACE INTO usuarios (username, password_hash, role)
            VALUES (%s, %s, %s)
        """
        cursor.execute(sql, (username, hashed_password, 'admin'))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        # print(f"Utilizador '{username}' criado/atualizado com sucesso!")
        # print(f"Hash gerado: {hashed_password}")

    except Exception as e:
        print(f"Ocorreu um erro: {e}")

if __name__ == "__main__":
    create_user()
