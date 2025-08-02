// Agendamento/Agendamento.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Agendamento.module.css";

// ... (função formatarTelefone permanece a mesma) ...
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
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const Agendamento = () => {
  const navigate = useNavigate();
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
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
    horariosDisponiveis.length > 0 &&
    horariosDisponiveis.every((h) => horariosOcupados.includes(h));

  useEffect(() => {
    if (!formData.data || !formData.unidade) {
      setHorariosDisponiveis([]);
      setHorariosOcupados([]);
      return;
    };

    fetch(
      `http://localhost:5000/api/horarios-disponiveis/${formData.data}/${formData.unidade}`
    )
      .then((res) => res.json())
      .then((data) => {
        setHorariosDisponiveis(data.todos || []);
        setHorariosOcupados(data.ocupados || []);

        if ((data.ocupados || []).includes(formData.horario)) {
          setFormData((prev) => ({ ...prev, horario: "" }));
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar horários disponíveis:", error);
        setHorariosDisponiveis([]);
        setHorariosOcupados([]);
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
      const response = await fetch("http://localhost:5000/api/agendamentos", {
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
        setMensagemErro("Este horário já foi reservado. Por favor, escolha outro.");
        setMostrarConfirmacao(false);
        setHorariosOcupados(prev => [...prev, formData.horario]);
        setFormData((prev) => ({ ...prev, horario: "" }));
      } else {
        setMensagemErro("Erro ao agendar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      setMensagemErro("Erro ao conectar com o servidor.");
    }
  };

  const unidadeTexto =
    formData.unidade === "1" ? "Unidade 1 - EQNP" : "Unidade 2 - QNP";

  return (
    // --- CORREÇÃO: Adicionado um container pai para aplicar o estilo da página ---
    <div className={styles.pageContainer}>
      <div className={styles.wrapper}>
        {mostrarConfirmacao && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Confirmar Agendamento</h3>
              <p><strong>Nome:</strong> {formData.nome} {formData.sobrenome}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Telefone:</strong> {formData.telefone}</p>
              <p><strong>Data:</strong> {formatarData(formData.data)}</p>
              <p><strong>Horário:</strong> {formData.horario}</p>
              <p><strong>Unidade:</strong> {unidadeTexto}</p>
              <div className={styles.modalButtons}>
                <button onClick={enviarAgendamento}>Confirmar</button>
                <button onClick={() => setMostrarConfirmacao(false)}>Editar</button>
              </div>
            </div>
          </div>
        )}

        {mensagemErro && (
          <div className={styles.modal}>
              <div className={styles.modalContent}>
                <p>{mensagemErro}</p>
                <div className={styles.modalButtons}>
                  <button onClick={() => setMensagemErro("")}>Ok</button>
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
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome" required />
            <input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange} placeholder="Sobrenome" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone" required />
            <input type="date" name="data" value={formData.data} onChange={handleChange} min={today} required />
            <select name="horario" value={formData.horario} onChange={handleChange} required>
              <option value="">Selecione um horário</option>
              {horariosDisponiveis.length > 0 ? (
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
              ) : (
                formData.data && <option disabled>Nenhum horário disponível</option>
              )}
            </select>
            <div className={styles.unidade}>
              <label>
                <input type="radio" name="unidade" value="1" checked={formData.unidade === "1"} onChange={handleChange} />
                Unidade 1 - EQNP
              </label>
              <label>
                <input type="radio" name="unidade" value="2" checked={formData.unidade === "2"} onChange={handleChange} />
                Unidade 2 - QNP
              </label>
            </div>
            <div className={styles.botaoContainer}>
              <button type="submit" disabled={!formData.horario}>
                Agendar
              </button>
              <button type="button" onClick={() => navigate("/")}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Agendamento;
