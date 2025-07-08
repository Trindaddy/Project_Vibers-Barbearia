import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const irParaAgendamento = () => {
    navigate("/agendamento");
  };

  return (
    <div className="landing-container">
      <div className="header">
        <h3>Viber’s Barbearias</h3>
      </div>

      <div className="main-content">
        <div className="slogan">
          <h1>
            ESTILO
            <br />
            UNICO SEM
          </h1>
          <span className="destaque">Gastar</span>
        </div>
      </div>

      <div className="botao-container">
        <button onClick={irParaAgendamento}>
          Agende seu horário{" "}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
