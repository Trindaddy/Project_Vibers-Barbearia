import "./Agendamento.css";
import { useNavigate } from "react-router-dom";

function Agendamento() {
  const navigate = useNavigate();

  const handleCancelar = () => {
    navigate("/");
  };

  const handleContinuar = () => {
    alert("Agendamento concluído!");
  };

  return (
    <div className="pagina-agendamento">
      <h1 className="titulo">Viber’s Barbearia</h1>

      <div className="container-form">
        <div className="top-box">
          <h2>Agende o seu horário</h2>
          <p>
            Agende seu horário com facilidade! Basta selecionar o melhor
            horário e pronto!
          </p>
        </div>

        <form>
          <label htmlFor="nome">Nome Completo</label>
          <input type="text" id="nome" placeholder="Seu nome" />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="exemplo@company.com" />

          <label htmlFor="telefone">Telefone</label>
          <input type="tel" id="telefone" placeholder="61 91234 5678" />

          <label htmlFor="data">Data</label>
          <input type="text" id="data" placeholder="dd/mm/aaaa" />

          <label htmlFor="horario">Horário</label>
          <input type="text" id="horario" placeholder="Selecione o seu horário" />
        </form>
      </div>

      <div className="botao-container">
        <button onClick={handleCancelar}>
          Cancelar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <button onClick={handleContinuar}>
          Continuar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

export default Agendamento;
