import styles from './Confirmacao.module.css';
import { useNavigate, useLocation } from "react-router-dom";

function Confirmacao() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Função de formatação mais segura e simples
  function formatarData(dataString) {
    // Se não houver data ou ela não for uma string, retorna vazio
    if (!dataString || typeof dataString !== 'string') return "";

    // Divide a string "AAAA-MM-DD" em um array ["AAAA", "MM", "DD"]
    const partes = dataString.split("-");

    // Retorna a data no formato "DD/MM/AAAA"
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Pega os dados do state, com valores padrão caso o usuário chegue aqui por engano
  const dataFormatada = formatarData(state?.data);
  const horario = state?.horario || "não informado";
  const unidade = state?.unidade || "não informada";

  const handleNovoAgendamento = () => {
    navigate("/agendamento");
  };

  return (
    <div className={styles.paginaConfirmacao}>
      <h3>Viber’s Barbearias</h3>

      <div className={styles.mensagemCentral}>
        <h1>💈 Nos vemos em breve!</h1>
        <div className={styles.checkIcon}>
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <p className={styles.descricao}>
          Você merece esse cuidado! <br />
          Prepare-se para relaxar e sair renovado. Até breve!
        </p>

        <div className={styles.resumo}>
          <p>
            <span className="material-symbols-outlined">calendar_month</span>{" "}
            <strong>Data:</strong> {dataFormatada}
          </p>
          <p>
            <span className="material-symbols-outlined">schedule</span>{" "}
            <strong>Horário:</strong> {horario}
          </p>
          <p>
            <span className="material-symbols-outlined">location_on</span>{" "}
            <strong>Unidade:</strong> {unidade}
          </p>
        </div>
      </div>

      <div className={styles.botoes}>
        <button onClick={handleNovoAgendamento}>
          Novo Agendamento{" "}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

export default Confirmacao;
