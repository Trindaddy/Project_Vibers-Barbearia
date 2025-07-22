import styles from './Confirmacao.module.css';
import { useNavigate } from "react-router-dom";

function Confirmacao() {
  const navigate = useNavigate();

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
            <strong>Data:</strong> 
          </p>
          <p>
            <span className="material-symbols-outlined">schedule</span>{" "}
            <strong>Horário:</strong> 
          </p>
          <p>
            <span className="material-symbols-outlined">location_on</span>{" "}
            <strong>Unidade:</strong> 
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
