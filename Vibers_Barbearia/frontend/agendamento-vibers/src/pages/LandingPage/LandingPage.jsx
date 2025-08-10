import React, { useState, useEffect } from 'react'; // Adicionado useState e useEffect
import { useNavigate } from "react-router-dom";
import styles from './LandingPage.module.css';

const API_BASE = "http://localhost:5000";

function LandingPage() {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState(''); // Estado para a URL da logo

  // Busca a URL da logo ao carregar a página
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/configuracoes`);
        const data = await res.json();
        if (data.logo_url) {
          setLogoUrl(`${API_BASE}${data.logo_url}`);
        }
      } catch (error) {
        console.error("Erro ao buscar logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const irParaAgendamento = () => {
    navigate("/agendamento");
  };

  return (
    <div className={styles.landingContainer}>
      <div className={styles.header}>
        {/* O h3 foi substituído por uma imagem */}
        {logoUrl ? (
          <img src={logoUrl} alt="Viber's Barbearias Logo" className={styles.logo} />
        ) : (
          <h3>Viber’s Barbearias</h3>
        )}
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
