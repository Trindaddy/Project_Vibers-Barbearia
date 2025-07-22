import { useNavigate } from "react-router-dom";
import styles from './LandingPage.module.css';

function LandingPage() {
  const navigate = useNavigate();

  const irParaAgendamento = () => {
    navigate("/agendamento");
  };

  return (
    <div className={styles.landingContainer}>
      <div className={styles.header}>
        <h3>Viber’s Barbearias</h3>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.slogan}>
          <h1>
            ESTILO
            <br />
            UNICO SEM
          </h1>
          <span className={styles.destaque}>Gastar</span>
        </div>
      </div>

      <div className={styles.botaoContainer}>
        <button onClick={irParaAgendamento}>
          Agende seu horário{" "}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
