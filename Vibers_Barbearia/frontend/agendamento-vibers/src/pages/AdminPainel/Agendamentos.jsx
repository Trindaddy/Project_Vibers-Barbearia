// AdminPainel/Agendamentos.jsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./Agendamentos.module.css";

const STATUS_OPCOES = ["pendente", "confirmado", "concluido", "cancelado"];

// Formata um número de telefone para o padrão (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
function formatarTelefone(telefone) {
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
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");

  const fetchAgendamentos = async () => {
    try {
      const res = await fetch(`${API_BASE}/agendamentos`);
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
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: novoStatus } : item
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir?");
    if (!confirmar) return;
    
    try {
      const res = await fetch(`${API_BASE}/agendamentos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setAgendamentos((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
    const interval = setInterval(fetchAgendamentos, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h2>Agendamentos Recebidos</h2>
      {mensagemErro && <div className={styles.erro}>{mensagemErro}</div>}
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
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            ) : (
              agendamentos.map((item) => {
                let formattedDate = "Data inválida";
                if (item.data) {
                  // CORREÇÃO: Cria um objeto Date manualmente para garantir o fuso horário local.
                  // A string de data (ex: "2025-07-31") é dividida e o mês é ajustado (é 0-indexed no JS).
                  const [year, month, day] = item.data.split('-').map(Number);
                  const localDate = new Date(year, month - 1, day);
                  if (!isNaN(localDate.getTime())) {
                    formattedDate = format(localDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
                  }
                }
                
                return (
                  <tr key={item.id}>
                    <td>
                      {item.nome} {item.sobrenome}
                    </td>
                    <td>{item.email}</td>
                    <td>{formatarTelefone(item.telefone)}</td>
                    <td>
                      {formattedDate}
                    </td>
                    <td>{item.horario}</td>
                    <td>{item.unidade === 1 ? "Unidade 1" : "Unidade 2"}</td>
                    <td>
                      <select
                        value={item.status || "pendente"}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value)
                        }
                        className={`${styles.status} ${
                          styles[item.status] || styles.pendente
                        }`}
                      >
                        {STATUS_OPCOES.map((op) => (
                          <option key={op} value={op}>
                            {op.charAt(0).toUpperCase() + op.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.botoes}>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={styles.botaoExcluir}
                        title="Excluir"
                      >
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
