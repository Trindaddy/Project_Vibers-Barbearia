import styles from './Agendamento.module.css';
import { useNavigate } from "react-router-dom";

function Agendamento() {
  const navigate = useNavigate();

  const handleCancelar = () => {
    navigate("/");
  };

  const handleContinuar = () => {
    alert("Agendamento concluído!");
    navigate("/confirmacao");
  };

  return (
    <div className={styles.paginaAgendamento}>
      <h1 className={styles.titulo}>Viber’s Barbearia</h1>

      <div className={styles.containerForm}>
        <div className={styles.topBox}>
          <h2>Agende o seu horário</h2>
          <p>
            Agende seu horário com facilidade! Basta selecionar o melhor horário
            e pronto!
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
          <input
            type="text"
            id="horario"
            placeholder="Selecione o seu horário"
          />
        </form>
      </div>

      <div className={styles.botaoContainer}>
        <button onClick={handleCancelar}>
          <span className="material-symbols-outlined">close</span> Cancelar
        </button>
        <button onClick={handleContinuar}>
          <span className="material-symbols-outlined">arrow_forward</span>{" "}
          Continuar
        </button>
      </div>
    </div>
  );
}

export default Agendamento;
