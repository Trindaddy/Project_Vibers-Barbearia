import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPainel.module.css';
import { FaCalendarAlt, FaCog, FaImage, FaSignOutAlt } from 'react-icons/fa'; // Ícone de logout

const AdminPainel = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove o token
    navigate('/login'); // Redireciona para o login
  };

  return (
    <div className={styles.container}>
      {/* NOVO: Cabeçalho com botão de logout */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Painel do Administrador</h2>
          <p className={styles.subtitle}>Gerencie seu sistema</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton} title="Sair">
          <FaSignOutAlt />
        </button>
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={() => navigate('/admin/agendamentos')}>
          <FaCalendarAlt className={styles.icon} />
          <h3>Agendamentos</h3>
          <p>Gerencie todos os horários agendados.</p>
          <button className={styles.button}>Ver Agendamentos</button>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/logos')}>
          <FaImage className={styles.icon} />
          <h3>Gerenciar Logos</h3>
          <p>Atualize e gerencie as imagens da marca.</p>
          <button className={styles.button}>Acessar</button>
        </div>

        <div className={styles.card} onClick={() => navigate('/admin/configuracoes')}>
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
