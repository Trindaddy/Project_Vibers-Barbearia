// AdminPainel/Configuracoes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaCalendarTimes, FaCommentDots } from 'react-icons/fa';
import styles from './Configuracoes.module.css';

const API_BASE = "http://localhost:5000/api";

const Configuracoes = () => {
  const navigate = useNavigate();
  
  const [horarios, setHorarios] = useState({
    semana: { inicio: '', fim: '' },
    sabado: { inicio: '', fim: '' },
  });
  const [datasBloqueadas, setDatasBloqueadas] = useState([]);
  const [dataInput, setDataInput] = useState('');
  const [mensagens, setMensagens] = useState({
    confirmacao: "",
    lembrete: "",
  });

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        const res = await fetch(`${API_BASE}/configuracoes`);
        const data = await res.json();
        
        // --- CORREÇÃO AINDA MAIS ROBUSTA ---
        // Garante que os dados são do tipo correto antes de atualizar o estado.

        // Para Horarios
        const fetchedHorarios = data.horarios || {};
        if (typeof fetchedHorarios === 'object' && !Array.isArray(fetchedHorarios)) {
            setHorarios(prev => ({
                semana: {...prev.semana, ...fetchedHorarios.semana},
                sabado: {...prev.sabado, ...fetchedHorarios.sabado}
            }));
        }
        
        // Para Datas Bloqueadas
        let fetchedBlockedDates = data.datas_bloqueadas || [];
        if (typeof fetchedBlockedDates === 'string') {
          try {
            fetchedBlockedDates = JSON.parse(fetchedBlockedDates);
          } catch (e) {
            console.error("Falha ao fazer parse das datas bloqueadas:", e);
            fetchedBlockedDates = [];
          }
        }
        // A verificação final garante que apenas uma lista seja definida no estado
        if (Array.isArray(fetchedBlockedDates)) {
          setDatasBloqueadas(fetchedBlockedDates);
        } else {
          setDatasBloqueadas([]); // Como último recurso, define uma lista vazia
        }

        // Para Mensagens
        const fetchedMensagens = data.mensagens || {};
        if (typeof fetchedMensagens === 'object' && !Array.isArray(fetchedMensagens)) {
            setMensagens(prev => ({...prev, ...fetchedMensagens}));
        }

      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };
    fetchConfiguracoes();
  }, []);

  const handleAddData = () => {
    if (dataInput && !datasBloqueadas.includes(dataInput)) {
      setDatasBloqueadas([...datasBloqueadas, dataInput].sort());
      setDataInput('');
    }
  };

  const handleRemoveData = (dataParaRemover) => {
    setDatasBloqueadas(datasBloqueadas.filter(d => d !== dataParaRemover));
  };

  const handleSalvarTudo = async () => {
    try {
      const payload = {
        horarios,
        datas_bloqueadas: datasBloqueadas,
        mensagens,
      };
      
      const response = await fetch(`${API_BASE}/configuracoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Configurações salvas com sucesso!');
      } else {
        throw new Error('Falha ao salvar configurações');
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert('Erro ao salvar as configurações.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin')} className={styles.botaoVoltar} title="Voltar ao Painel">
          <FaArrowLeft />
        </button>
        <h2>Configurações Gerais</h2>
      </div>

      <div className={styles.content}>
        {/* Card de Horários */}
        <div className={styles.card}>
          <h3><FaClock /> Horários de Funcionamento</h3>
          <div className={styles.formGroup}>
            <label>Segunda a Sexta</label>
            <div className={styles.timeInputs}>
              <input type="time" value={horarios?.semana?.inicio || ''} onChange={e => setHorarios({...horarios, semana: {...horarios.semana, inicio: e.target.value}})} />
              <span>até</span>
              <input type="time" value={horarios?.semana?.fim || ''} onChange={e => setHorarios({...horarios, semana: {...horarios.semana, fim: e.target.value}})} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Sábados</label>
            <div className={styles.timeInputs}>
              <input type="time" value={horarios?.sabado?.inicio || ''} onChange={e => setHorarios({...horarios, sabado: {...horarios.sabado, inicio: e.target.value}})} />
              <span>até</span>
              <input type="time" value={horarios?.sabado?.fim || ''} onChange={e => setHorarios({...horarios, sabado: {...horarios.sabado, fim: e.target.value}})} />
            </div>
          </div>
        </div>

        {/* Card de Datas Bloqueadas */}
        <div className={styles.card}>
          <h3><FaCalendarTimes /> Datas Bloqueadas</h3>
          <p>Clientes não poderão agendar nestes dias.</p>
          <div className={styles.dateInputGroup}>
            <input type="date" value={dataInput} onChange={e => setDataInput(e.target.value)} />
            <button onClick={handleAddData}>Adicionar</button>
          </div>
          <ul className={styles.listaDatas}>
            {datasBloqueadas.map(data => (
              <li key={data}>
                {new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')}
                <button onClick={() => handleRemoveData(data)}>&times;</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Card de Mensagens */}
        <div className={styles.card}>
          <h3><FaCommentDots /> Mensagens Automáticas</h3>
          <p>Use [Nome], [Data], [Horário] e [Unidade] para personalizar.</p>
          <div className={styles.formGroup}>
            <label>Mensagem de Confirmação</label>
            <textarea value={mensagens?.confirmacao || ''} onChange={e => setMensagens({...mensagens, confirmacao: e.target.value})} rows="4"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label>Mensagem de Lembrete (1 dia antes)</label>
            <textarea value={mensagens?.lembrete || ''} onChange={e => setMensagens({...mensagens, lembrete: e.target.value})} rows="4"></textarea>
          </div>
        </div>
      </div>
      
      <div className={styles.footer}>
        <button className={styles.salvarTudoButton} onClick={handleSalvarTudo}>
          Salvar Todas as Configurações
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;
