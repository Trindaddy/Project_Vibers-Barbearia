import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Agendamento.module.css";

function gerarHorarios(inicio, fim, intervaloMin) {
  const horarios = [];
  let [hora, minuto] = inicio.split(":").map(Number);
  const [fimHora, fimMinuto] = fim.split(":").map(Number);

  while (hora < fimHora || (hora === fimHora && minuto <= fimMinuto)) {
    const horaStr = String(hora).padStart(2, "0");
    const minutoStr = String(minuto).padStart(2, "0");
    horarios.push(`${horaStr}:${minutoStr}`);
    minuto += intervaloMin;
    if (minuto >= 60) {
      minuto -= 60;
      hora += 1;
    }
  }

  return horarios;
}

const Agendamento = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    data: "",
    horario: "",
    unidade: "1",
  });

  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  useEffect(() => {
    if (!formData.data || !formData.unidade) return;

    const dataSelecionada = new Date(formData.data + "T00:00:00");
    const diaSemana = dataSelecionada.getDay();
    let horarios = [];

    if (diaSemana >= 1 && diaSemana <= 5) {
      horarios = gerarHorarios("09:00", "18:00", 60);
    } else {
      horarios = gerarHorarios("09:00", "14:00", 60);
    }

    const hoje = new Date();
    if (dataSelecionada.toDateString() === hoje.toDateString()) {
      const horaAtual = hoje.getHours();
      const minutoAtual = hoje.getMinutes();
      horarios = horarios.filter((h) => {
        const [hHora, hMin] = h.split(":").map(Number);
        return hHora > horaAtual || (hHora === horaAtual && hMin > minutoAtual);
      });
    }

    const agendamentosSalvos = JSON.parse(
      localStorage.getItem("agendamentos") || "[]"
    );
    const ocupados = agendamentosSalvos
      .filter(
        (a) =>
          a.data === formData.data &&
          a.unidade === formData.unidade &&
          a.horario !== ""
      )
      .map((a) => a.horario);

    setHorariosDisponiveis(horarios);
    setHorariosOcupados(ocupados);
  }, [formData.data, formData.unidade]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const agendamentos = JSON.parse(
      localStorage.getItem("agendamentos") || "[]"
    );
    agendamentos.push(formData);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
    navigate("/confirmacao");
  };

  const handleCancelar = () => {
    setFormData({
      nome: "",
      sobrenome: "",
      email: "",
      telefone: "",
      data: "",
      horario: "",
      unidade: "1",
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftPane}>
        <h2>Preencha seus dados</h2>
        <p>Escolha a data, horário e unidade desejada para o atendimento</p>
      </div>
      <div className={styles.rightPane}>
        <form onSubmit={handleSubmit}>
          <h2>Agendamento</h2>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome"
            required
          />
          <input
            type="text"
            name="sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
            placeholder="Sobrenome"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            required
          />
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />

          <select
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um horário</option>
            {horariosDisponiveis.map((horario) => (
              <option
                key={horario}
                value={horario}
                disabled={horariosOcupados.includes(horario)}
              >
                {horario}{" "}
                {horariosOcupados.includes(horario) ? "(Indisponível)" : ""}
              </option>
            ))}
          </select>

          <div className={styles.unidade}>
            <label>
              <input
                type="radio"
                name="unidade"
                value="1"
                checked={formData.unidade === "1"}
                onChange={handleChange}
              />
              Unidade 1
            </label>
            <label>
              <input
                type="radio"
                name="unidade"
                value="2"
                checked={formData.unidade === "2"}
                onChange={handleChange}
              />
              Unidade 2
            </label>
          </div>

          <div className={styles.botaoContainer}>
            <button type="submit">
              Agendar
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button type="button" onClick={() => navigate("/")}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agendamento;
