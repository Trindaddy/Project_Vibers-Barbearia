import styles from './Confirmacao.module.css';
import { useNavigate, useLocation } from "react-router-dom";

function Confirmacao() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleNovoAgendamento = () => {
    navigate("/agendamento");
  };

  function formatarData(dataISO) {
    const dataObj = new Date(dataISO);
    if (isNaN(dataObj)) return "data inválida";

    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    const ano = String(dataObj.getFullYear()).slice(-2);

    return `${dia}-${mes}-${ano}`;
  }

  const rawData = state?.data || "não informado";
  const data = rawData !== "não informado" ? formatarData(rawData) : rawData;
  const horario = state?.horario || "não informado";
  const unidade = state?.unidade || "não informada";

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
            <strong>Data:</strong> {data}
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
