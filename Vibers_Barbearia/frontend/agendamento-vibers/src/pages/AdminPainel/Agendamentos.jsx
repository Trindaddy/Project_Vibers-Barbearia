import React, { useEffect, useState } from 'react';
import styles from './Agendamentos.module.css';
import { FaTrashAlt } from 'react-icons/fa';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar agendamentos do backend
  useEffect(() => {
    fetch('http://localhost:5000/api/agendamentos')
      .then((res) => res.json())
      .then((data) => {
        setAgendamentos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar agendamentos:', err);
        setLoading(false);
      });
  }, []);

  // Deletar agendamento
  const handleDelete = (id) => {
    if (window.confirm('Deseja realmente excluir este agendamento?')) {
      fetch(`http://localhost:5000/api/agendamentos/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            setAgendamentos(agendamentos.filter((item) => item.id !== id));
          } else {
            console.error('Erro ao deletar');
          }
        })
        .catch((err) => console.error('Erro ao excluir agendamento:', err));
    }
  };

  return (
    <div className={styles.container}>
      <h2>Agendamentos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Unidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((item) => (
              <tr key={item.id}>
                <td>{item.nome} {item.sobrenome}</td>
                <td>{item.email}</td>
                <td>{item.telefone}</td>
                <td>{item.data}</td>
                <td>{item.horario}</td>
                <td>{item.unidade}</td>
                <td>
                  <button onClick={() => handleDelete(item.id)} className={styles.botaoExcluir}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Agendamentos;
