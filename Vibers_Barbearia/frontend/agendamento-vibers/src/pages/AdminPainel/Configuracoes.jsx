// AdminPainel/Configuracoes.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaCalendarTimes, FaCommentDots } from 'react-icons/fa';
import styles from './Configuracoes.module.css';

const Configuracoes = () => {
  const navigate = useNavigate();
  
  // Estados para cada configuração (valores de exemplo)
  const [horarios, setHorarios] = useState({
    semana: { inicio: '08:00', fim: '20:00' },
    sabado: { inicio: '08:00', fim: '13:00' },
  });
  const [datasBloqueadas, setDatasBloqueadas] = useState(['2025-12-25', '2026-01-01']);
  const [dataInput, setDataInput] = useState('');
  const [mensagens, setMensagens] = useState({
    confirmacao: "Olá [Nome], seu horário no dia [Data] às [Horário] na [Unidade] está confirmado! Agradecemos pela preferência!",
    lembrete: "Olá [Nome], lembrando que seu horário é amanhã, dia [Data] às [Horário]. Até lá!",
  });

  const handleAddData = () => {
    if (dataInput && !datasBloqueadas.includes(dataInput)) {
      setDatasBloqueadas([...datasBloqueadas, dataInput].sort());
      setDataInput('');
    }
  };

  const handleRemoveData = (dataParaRemover) => {
    setDatasBloqueadas(datasBloqueadas.filter(d => d !== dataParaRemover));
  };

  const handleSalvarTudo = () => {
    // Em um projeto real, você enviaria os states 'horarios', 'datasBloqueadas' e 'mensagens'
    // para um endpoint no backend que salvaria essas configurações no banco de dados.
    console.log('Salvando horários:', horarios);
    console.log('Salvando datas bloqueadas:', datasBloqueadas);
    console.log('Salvando mensagens:', mensagens);
    alert('Configurações salvas com sucesso!');
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
              <input type="time" value={horarios.semana.inicio} onChange={e => setHorarios({...horarios, semana: {...horarios.semana, inicio: e.target.value}})} />
              <span>até</span>
              <input type="time" value={horarios.semana.fim} onChange={e => setHorarios({...horarios, semana: {...horarios.semana, fim: e.target.value}})} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Sábados</label>
            <div className={styles.timeInputs}>
              <input type="time" value={horarios.sabado.inicio} onChange={e => setHorarios({...horarios, sabado: {...horarios.sabado, inicio: e.target.value}})} />
              <span>até</span>
              <input type="time" value={horarios.sabado.fim} onChange={e => setHorarios({...horarios, sabado: {...horarios.sabado, fim: e.target.value}})} />
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
            <textarea value={mensagens.confirmacao} onChange={e => setMensagens({...mensagens, confirmacao: e.target.value})} rows="4"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label>Mensagem de Lembrete (1 dia antes)</label>
            <textarea value={mensagens.lembrete} onChange={e => setMensagens({...mensagens, lembrete: e.target.value})} rows="4"></textarea>
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
