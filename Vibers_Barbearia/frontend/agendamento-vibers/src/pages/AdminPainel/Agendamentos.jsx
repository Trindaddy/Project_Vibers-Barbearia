// AdminPainel/Agendamentos.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
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
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("pendente");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState({ pendente: 0, concluido: 0, cancelado: 0, hoje: 0 });

  const apiFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      throw new Error('No token found');
    }
    const headers = { 'Authorization': `Bearer ${token}`, ...options.headers };
    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      navigate('/login');
      throw new Error('Unauthorized');
    }
    return response;
  }, [navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      const res = await apiFetch(`${API_BASE}/agendamentos/stats?${params.toString()}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error("Erro ao buscar estatísticas:", error);
      }
    }
  }, [apiFetch, startDate, endDate]);

  const fetchAgendamentos = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        status: filtroStatus,
        search: searchTerm,
        start_date: startDate,
        end_date: endDate,
      });
      const res = await apiFetch(`${API_BASE}/agendamentos?${params.toString()}`);
      const data = await res.json();
      setAgendamentos(data);
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error("Erro ao buscar agendamentos:", error);
        setMensagemErro("Não foi possível carregar os agendamentos.");
      }
    }
  }, [apiFetch, filtroStatus, searchTerm, startDate, endDate]);
  
  const handleStatusChange = async (id, novoStatus) => {
    try {
      await apiFetch(`${API_BASE}/agendamentos/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: novoStatus }),
      });
      setAgendamentos((prev) => prev.filter((item) => item.id !== id));
      fetchStats();
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        console.error("Erro ao atualizar status:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      try {
        await apiFetch(`${API_BASE}/agendamentos/${id}`, { method: "DELETE" });
        setAgendamentos((prev) => prev.filter((item) => item.id !== id));
        fetchStats();
      } catch (error) {
        if (error.message !== 'Unauthorized') {
          console.error("Erro ao excluir agendamento:", error);
        }
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAgendamentos();
    fetchStats();
  }, [fetchAgendamentos, fetchStats, navigate]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

  const getDashboardTitle = () => {
    if (startDate && endDate) {
      const start = format(new Date(startDate + 'T00:00:00'), 'dd/MM');
      const end = format(new Date(endDate + 'T00:00:00'), 'dd/MM/yyyy');
      return `Resumo de ${start} a ${end}`;
    }
    if (startDate) {
      const start = format(new Date(startDate + 'T00:00:00'), 'dd/MM/yyyy');
      return `Resumo a partir de ${start}`;
    }
    if (endDate) {
      const end = format(new Date(endDate + 'T00:00:00'), 'dd/MM/yyyy');
      return `Resumo até ${end}`;
    }
    return 'Resumo Geral';
  };

  const STATUS_OPCOES = ["pendente", "concluido", "cancelado"];

  return (
    <div className={styles.container}>
      <Dashboard stats={stats} title={getDashboardTitle()} />
      
      <div className={styles.header}>
        <button onClick={() => navigate('/admin')} className={styles.botaoVoltar} title="Voltar ao Painel">
          <FaArrowLeft />
        </button>
        <h2>Agendamentos</h2>
      </div>

      <div className={stylesFiltro.filterGroup}>
        <div className={stylesFiltro.searchAndDate}>
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            className={stylesFiltro.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={stylesFiltro.datePickers}>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span>até</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button onClick={handleClearFilters} className={stylesFiltro.clearButton}>Limpar</button>
        </div>
        
        <div className={stylesFiltro.container}>
            <button onClick={() => setFiltroStatus('pendente')} className={filtroStatus === 'pendente' ? stylesFiltro.ativo : ''}>Pendentes</button>
            <button onClick={() => setFiltroStatus('concluido')} className={filtroStatus === 'concluido' ? stylesFiltro.ativo : ''}>Concluídos</button>
            <button onClick={() => setFiltroStatus('cancelado')} className={filtroStatus === 'cancelado' ? stylesFiltro.ativo : ''}>Cancelados</button>
        </div>
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
