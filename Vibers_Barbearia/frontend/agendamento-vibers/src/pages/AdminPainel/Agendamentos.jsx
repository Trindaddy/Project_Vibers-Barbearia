// AdminPainel/Agendamentos.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importado para navegação
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa"; // Ícone de voltar adicionado
import styles from "./Agendamentos.module.css";
import Dashboard from './Dashboard';
import stylesFiltro from './Filtros.module.css';

function formatarTelefone(telefone) {
  if (!telefone) return "";
  const numeros = telefone.replace(/\D/g, "").slice(0, 11);
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return numeros;
  }
}

const API_BASE = "http://localhost:5000/api";

export default function Agendamentos() {
  const navigate = useNavigate(); // Hook para navegação
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("pendente");
  const [stats, setStats] = useState({ pendente: 0, concluido: 0, cancelado: 0, hoje: 0 });

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/agendamentos/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const fetchAgendamentos = async () => {
    try {
      const res = await fetch(`${API_BASE}/agendamentos?status=${filtroStatus}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setAgendamentos(data);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setMensagemErro("Não foi possível carregar os agendamentos.");
    }
  };
  
  const handleStatusChange = async (id, novoStatus) => {
    try {
      const res = await fetch(`${API_BASE}/agendamentos/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      if (novoStatus !== filtroStatus) {
        setAgendamentos((prev) => prev.filter((item) => item.id !== id));
      } else {
        setAgendamentos((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: novoStatus } : item
          )
        );
      }
      
      fetchStats();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir?");
    if (!confirmar) return;
    
    try {
      const res = await fetch(`${API_BASE}/agendamentos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setAgendamentos((prev) => prev.filter((item) => item.id !== id));
      fetchStats();
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
    fetchStats();

    const interval = setInterval(() => {
      fetchAgendamentos();
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [filtroStatus]);

  const STATUS_OPCOES = ["pendente", "concluido", "cancelado"];

  return (
    <div className={styles.container}>
      <Dashboard stats={stats} />
      
      {/* --- NOVO CABEÇALHO COM BOTÃO DE VOLTAR --- */}
      <div className={styles.header}>
        <button onClick={() => navigate('/admin')} className={styles.botaoVoltar} title="Voltar ao Painel">
          <FaArrowLeft />
        </button>
        <h2>Agendamentos Recebidos</h2>
      </div>

      <div className={stylesFiltro.container}>
        <button onClick={() => setFiltroStatus('pendente')} className={filtroStatus === 'pendente' ? stylesFiltro.ativo : ''}>Pendentes</button>
        <button onClick={() => setFiltroStatus('concluido')} className={filtroStatus === 'concluido' ? stylesFiltro.ativo : ''}>Concluídos</button>
        <button onClick={() => setFiltroStatus('cancelado')} className={filtroStatus === 'cancelado' ? stylesFiltro.ativo : ''}>Cancelados</button>
      </div>
      
       <div className={styles.tabelaContainer}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Unidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.semDados}>
                  Nenhum agendamento encontrado para este filtro.
                </td>
              </tr>
            ) : (
              agendamentos.map((item) => {
                let formattedDate = "Data inválida";
                if (item.data) {
                  const [year, month, day] = item.data.split('-').map(Number);
                  const localDate = new Date(year, month - 1, day);
                  if (!isNaN(localDate.getTime())) {
                    formattedDate = format(localDate, "EEEE, dd 'de' MMMM", { locale: ptBR });
                  }
                }
                
                return (
                  <tr key={item.id}>
                    <td>{item.nome} {item.sobrenome}</td>
                    <td>{item.email}</td>
                    <td>{formatarTelefone(item.telefone)}</td>
                    <td>{formattedDate}</td>
                    <td>{item.horario}</td>
                    <td>{`Unidade ${item.unidade}`}</td>
                    <td>
                      <select
                        value={item.status || "pendente"}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`${styles.status} ${styles[item.status] || styles.pendente}`}
                      >
                        {STATUS_OPCOES.map((op) => (
                          <option key={op} value={op}>
                            {op.charAt(0).toUpperCase() + op.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.botoes}>
                      <button onClick={() => handleDelete(item.id)} className={styles.botaoExcluir} title="Excluir">
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
