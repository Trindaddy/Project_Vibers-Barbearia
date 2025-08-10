// AdminPainel/Configuracoes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaCalendarTimes } from 'react-icons/fa';
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

  // --- LÓGICA DE PROTEÇÃO MOVIDA PARA DENTRO DO COMPONENTE ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        // Adicionado o cabeçalho de autenticação
        const res = await fetch(`${API_BASE}/configuracoes`, { headers: getAuthHeaders() });
        const data = await res.json();
        
        const fetchedHorarios = data.horarios || {};
        if (typeof fetchedHorarios === 'object' && !Array.isArray(fetchedHorarios)) {
            setHorarios(prev => ({
                semana: {...prev.semana, ...fetchedHorarios.semana},
                sabado: {...prev.sabado, ...fetchedHorarios.sabado}
            }));
        }
        
        let fetchedBlockedDates = data.datas_bloqueadas || [];
        if (typeof fetchedBlockedDates === 'string') {
          try {
            fetchedBlockedDates = JSON.parse(fetchedBlockedDates);
          } catch (e) {
            console.error("Falha ao fazer parse das datas bloqueadas:", e);
            fetchedBlockedDates = [];
          }
        }
        if (Array.isArray(fetchedBlockedDates)) {
          setDatasBloqueadas(fetchedBlockedDates);
        } else {
          setDatasBloqueadas([]);
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
      };
      
      // Adicionado o cabeçalho de autenticação
      const response = await fetch(`${API_BASE}/configuracoes`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
