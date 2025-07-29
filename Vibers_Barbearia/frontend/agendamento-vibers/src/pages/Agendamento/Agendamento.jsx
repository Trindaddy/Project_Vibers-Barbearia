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

function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  if (numeros.length <= 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  } else {
    return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  }
}

const Agendamento = () => {
  const navigate = useNavigate();
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

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
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!formData.data || !formData.unidade) return;

    const dataSelecionada = new Date(formData.data + "T00:00:00");
    const diaSemana = dataSelecionada.getDay();
    let horarios = [];

    if (diaSemana >= 1 && diaSemana <= 5) {
      horarios = gerarHorarios("08:00", "20:00", 15);
    } else {
      horarios = gerarHorarios("09:00", "13:00", 15);
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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "telefone" ? formatarTelefone(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMostrarConfirmacao(true);
  };

  const enviarAgendamento = async () => {
    try {
      const response = await fetch("http://localhost:5000/agendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // ou como você estiver passando os dados
      });

      if (response.ok) {
        navigate("/confirmacao", {
          state: {
            data: formData.data,
            horario: formData.horario,
            unidade:
              formData.unidade === "1" ? "Unidade 1 - EQNP" : "Unidade 2 - QNP",
          },
        });
      } else {
        alert("Erro ao agendar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const unidadeTexto =
    formData.unidade === "1" ? "Unidade 1 - EQNP" : "Unidade 2 - QNP";

  return (
    <div className={styles.wrapper}>
      {mostrarConfirmacao && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirmar Agendamento</h3>
            <p>
              <strong>Nome:</strong> {formData.nome} {formData.sobrenome}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Telefone:</strong> {formData.telefone}
            </p>
            <p>
              <strong>Data:</strong> {formData.data}
            </p>
            <p>
              <strong>Horário:</strong> {formData.horario}
            </p>
            <p>
              <strong>Unidade:</strong> {unidadeTexto}
            </p>

            <div className={styles.modalButtons}>
              <button onClick={enviarAgendamento}>Confirmar</button>
              <button onClick={() => setMostrarConfirmacao(false)}>
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

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
            min={today}
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
              Unidade 1 - EQNP
            </label>
            <label>
              <input
                type="radio"
                name="unidade"
                value="2"
                checked={formData.unidade === "2"}
                onChange={handleChange}
              />
              Unidade 2 - QNP
            </label>
          </div>

          <div className={styles.botaoContainer}>
            <button type="submit">Agendar</button>
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
