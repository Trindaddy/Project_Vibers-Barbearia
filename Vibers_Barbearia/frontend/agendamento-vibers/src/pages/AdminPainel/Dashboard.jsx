// AdminPainel/Dashboard.jsx

import React from 'react';
import styles from './Dashboard.module.css';

// ALTERAÇÃO: O componente agora recebe 'stats' como uma propriedade (props)
// e não tem mais lógica interna de busca de dados.
const Dashboard = ({ stats }) => {
  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.dashboardTitle}>Resumo</h2>
      <div className={styles.cardContainer}>
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