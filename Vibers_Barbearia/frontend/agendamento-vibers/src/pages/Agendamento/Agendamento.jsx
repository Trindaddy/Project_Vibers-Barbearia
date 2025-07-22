import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Agendamento.module.css";

function AgendamentoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    data: "",
    horario: "",
  });

  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  // Atualiza os horários com base no dia da semana
  useEffect(() => {
    if (formData.data) {
      const diaSemana = new Date(formData.data).getDay();
      let horarios = [];

      if (diaSemana === 0) {
        for (let h = 9; h <= 13; h++) {
          horarios.push(`${h.toString().padStart(2, "0")}:00`);
        }
      } else {
        for (let h = 9; h <= 20; h++) {
          horarios.push(`${h.toString().padStart(2, "0")}:00`);
        }
      }

      setHorariosDisponiveis(horarios);

      if (formData.horario !== "") {
        setFormData((prev) => ({
          ...prev,
          horario: "",
        }));
      }
    }
  }, [formData.data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Máscara telefone (formato brasileiro)
    if (name === "telefone") {
      let telefone = value.replace(/\D/g, "");

      if (telefone.length > 11) {
        telefone = telefone.slice(0, 11);
      }

      if (telefone.length > 10) {
        // (99) 99999-9999
        telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
      } else if (telefone.length > 5) {
        // (99) 9999-9999
        telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else if (telefone.length > 2) {
        // (99) 99999
        telefone = telefone.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
      } else if (telefone.length > 0) {
        telefone = telefone.replace(/^(\d{0,2})/, "($1");
      }

      setFormData((prev) => ({
        ...prev,
        [name]: telefone,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simples validação
    if (Object.values(formData).some((v) => v.trim() === "")) {
      alert("Preencha todos os campos!");
      return;
    }
    // Salvar no localStorage e ir para confirmação
    localStorage.setItem("agendamento", JSON.stringify(formData));
    navigate("/confirmacao");
  };

  const handleCancel = () => {
    navigate("/");
  };

  // Data mínima para hoje no formato yyyy-mm-dd
  const dataMinima = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.paginaAgendamento}>
      <h1 className={styles.titulo}>Agendamento</h1>

      <div className={styles.containerForm}>
        <div className={styles.topBox}>
          <h2>Preencha seus dados</h2>
          <p>Escolha a data e horário desejado para seu atendimento</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />

          <label>Sobrenome:</label>
          <input
            type="text"
            name="sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Telefone:</label>
          <input
            type="text"
            name="telefone"
            maxLength={15}
            value={formData.telefone}
            onChange={handleChange}
            required
            placeholder="(99) 99999-9999"
          />

          <label>Data:</label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
            min={dataMinima}
          />

          <label>Horário:</label>
          <select
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um horário</option>
            {horariosDisponiveis.map((hora) => (
              <option key={hora} value={hora}>
                {hora}
              </option>
            ))}
          </select>

          <div className={styles.botaoContainer}>
            <button type="button" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit">
              Continuar
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Agendamento;
