import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPainel.module.css';
import { FaCalendarAlt, FaCog, FaImage } from 'react-icons/fa';

const AdminPainel = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Painel do Administrador</h2>
      <p className={styles.subtitle}>Gerencie seu sistema</p>
      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={() => navigate('/admin/agendamentos')}>
          <FaCalendarAlt className={styles.icon} />
          <h3>Agendamentos</h3>
          <p>Gerencie todos os horários agendados.</p>
          <button className={styles.button}>Ver Agendamentos</button>
        </div>

        <div className={styles.card}>
          <FaImage className={styles.icon} />
          <h3>Gerenciar Logos</h3>
          <p>Atualize e gerencie as imagens da marca.</p>
          <button className={styles.button}>Acessar</button>
        </div>

        <div className={styles.card}>
          <FaCog className={styles.icon} />
          <h3>Configurações</h3>
          <p>Personalize opções e preferências.</p>
          <button className={styles.button}>Ajustar</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPainel;
