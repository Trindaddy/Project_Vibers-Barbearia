import "./Confirmacao.css";
import { useNavigate } from "react-router-dom";

function Confirmacao() {
  const navigate = useNavigate();

  const handleNovoAgendamento = () => {
    navigate("/agendamento");
  };

  const handleVoltarInicio = () => {
    navigate("/");
  };

  return (
    <div className="pagina-confirmacao">
      <h3>Viber’s Barbearias</h3>

      <div className="mensagem-central">
        <h1>💈 Nos vemos em breve!</h1>
        <div className="check-icon">
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <p className="descricao">
          Você merece esse cuidado! <br />
          Prepare-se para relaxar e sair renovado. Até breve!
        </p>

        <div className="resumo">
          <p>
            <span className="material-symbols-outlined">calendar_month</span>{" "}
            <strong>Data:</strong> 10/07/2025
          </p>
          <p>
            <span className="material-symbols-outlined">schedule</span>{" "}
            <strong>Horário:</strong> 14:00
          </p>
          <p>
            <span className="material-symbols-outlined">location_on</span>{" "}
            <strong>Unidade:</strong> Asa Norte
          </p>
        </div>
      </div>

      <div className="botoes">
        <button onClick={handleVoltarInicio}>
          Voltar{" "}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <button onClick={handleNovoAgendamento}>
          Novo Agendamento{" "}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

export default Confirmacao;
