// AdminPainel/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { FaUserClock } from 'react-icons/fa';

const API_BASE = "http://localhost:5000/api";

const Dashboard = ({ stats, getAuthHeaders }) => {
  const [proximoCliente, setProximoCliente] = useState(null);

  useEffect(() => {
    const fetchProximoCliente = async () => {
      try {
        const res = await fetch(`${API_BASE}/agendamentos/next`, { headers: getAuthHeaders() });
        const data = await res.json();
        setProximoCliente(data);
      } catch (error) {
        console.error("Erro ao buscar próximo cliente:", error);
      }
    };

    fetchProximoCliente();
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchProximoCliente, 30000);
    return () => clearInterval(interval);
  }, [stats]); // Re-executa se as estatísticas gerais mudarem

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Resumo</h2>
      <div className={styles.cardContainer}>
        {/* Card do Próximo Cliente */}
        <div className={`${styles.card} ${styles.nextClientCard}`}>
          <FaUserClock className={styles.nextClientIcon} />
          {proximoCliente && proximoCliente.nome ? (
            <div>
              <h3>{proximoCliente.nome} {proximoCliente.sobrenome}</h3>
              <p>Próximo às {proximoCliente.horario}</p>
            </div>
          ) : (
            <div>
              <h3>Nenhum cliente</h3>
              <p>Não há mais agendamentos pendentes para hoje.</p>
            </div>
          )}
        </div>

        {/* Outros Cards */}
        <div className={styles.card}>
          <h3>{stats.hoje || 0}</h3>
          <p>Agendamentos Hoje</p>
        </div>
        <div className={styles.card}>
          <h3>{stats.pendente || 0}</h3>
          <p>Pendentes</p>
        </div>
        <div className={styles.card}>
          <h3>{stats.concluido || 0}</h3>
          <p>Concluídos</p>
        </div>
        <div className={styles.card}>
          <h3>{stats.cancelado || 0}</h3>
          <p>Cancelados</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
