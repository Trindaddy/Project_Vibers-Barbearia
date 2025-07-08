import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const irParaAgendamento = () => {
    navigate("/agendamento");
  };

  return (
    <div className="landing-container">
      {/* Cabeçalho */}
      <div className="header">
        <h3>Viber’s Barbearias</h3>
      </div>

      {/* Texto central */}
      <div className="slogan">
        <h1>
          ESTILO <br />
          UNICO SEM
        </h1>
        <h1 className="destaque">Gastar</h1>
      </div>

      {/* Rodapé com botão */}
      <div className="botao-container">
        <button onClick={irParaAgendamento}>Agende seu horário →</button>
      </div>
    </div>
  );
}

export default LandingPage;
