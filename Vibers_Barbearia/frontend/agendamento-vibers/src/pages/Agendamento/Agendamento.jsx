import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Agendamento.module.css";

function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  if (numeros.length <= 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  } else {
    return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  }
}

const formatarData = (dataStr) => {
  if (!dataStr) return "";
  const partes = dataStr.split("-");
  // dataStr está no formato "yyyy-mm-dd"
  return `${partes[2]}-${partes[1]}-${partes[0].slice(2)}`; // dd-mm-yy
};

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

  const nenhumHorarioDisponivel =
    horariosDisponiveis.length === 0 ||
    horariosDisponiveis.every((h) => horariosOcupados.includes(h));

  useEffect(() => {
    if (!formData.data || !formData.unidade) return;

    fetch(
      `http://localhost:5000/horarios-disponiveis/${formData.data}/${formData.unidade}`
    )
      .then((res) => res.json())
      .then((data) => {
        const todos = data.todos || [];
        const ocupados = data.ocupados || [];

        // Ajusta para garantir que horários passados não apareçam (redundante, mas seguro)
        const agora = new Date();
        const hojeStr = agora.toISOString().split("T")[0];

        const filtrados = todos.filter((horario) => {
          if (formData.data === hojeStr) {
            const [h, m] = horario.split(":").map(Number);
            const horarioData = new Date();
            horarioData.setHours(h, m, 0, 0);
            return horarioData > agora;
          }
          return true;
        });

        setHorariosDisponiveis(filtrados);
        setHorariosOcupados(ocupados);

        // Limpa horário selecionado se estiver indisponível
        if (ocupados.includes(formData.horario)) {
          setFormData((prev) => ({ ...prev, horario: "" }));
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar horários disponíveis:", error);
      });
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
      const response = await fetch("http://localhost:5000/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      } else if (response.status === 409) {
        alert(
          "Este horário já foi reservado. Por favor, escolha outro horário."
        );
        setMostrarConfirmacao(false);

        // Atualiza os horários disponíveis após conflito
        fetch(
          `http://localhost:5000/horarios-disponiveis/${formData.data}/${formData.unidade}`
        )
          .then((res) => res.json())
          .then((data) => {
            setHorariosDisponiveis(data.todos || []);
            setHorariosOcupados(data.ocupados || []);
            setFormData((prev) => ({ ...prev, horario: "" }));
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
              <strong>Data:</strong> {formatarData(formData.data)}
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
            {horariosDisponiveis.length === 0 ? (
              <option disabled>Nenhum horário disponível</option>
            ) : (
              horariosDisponiveis.map((horario) => (
                <option
                  key={horario}
                  value={horario}
                  disabled={horariosOcupados.includes(horario)}
                >
                  {horario}{" "}
                  {horariosOcupados.includes(horario) ? "(Indisponível)" : ""}
                </option>
              ))
            )}
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
            <button
              type="submit"
              disabled={nenhumHorarioDisponivel || !formData.horario}
            >
              Agendar
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
