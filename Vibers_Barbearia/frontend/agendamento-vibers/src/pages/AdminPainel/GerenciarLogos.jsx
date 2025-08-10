// AdminPainel/GerenciarLogos.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaPalette } from 'react-icons/fa';
import styles from './GerenciarLogos.module.css';
import { useConfig } from '../Context/ConfigContext'; // 1. Importa o hook do contexto

const API_BASE = "http://localhost:5000";

const GerenciarLogos = () => {
  const navigate = useNavigate();
  const { logoUrl, updateLogoUrl } = useConfig(); // 2. Usa o contexto
  
  const [novaLogo, setNovaLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const getAuthHeaders = (isJson = true) => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNovaLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSalvar = async () => {
    if (!novaLogo) return;
    const formData = new FormData();
    formData.append('logo', novaLogo);

    try {
      const response = await fetch(`${API_BASE}/api/logo/upload`, {
        method: 'POST',
        headers: getAuthHeaders(false),
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newLogoUrl = `${API_BASE}${data.logo_url}`;
        updateLogoUrl(newLogoUrl); // 3. ATUALIZA o contexto global
        setNovaLogo(null);
        setPreviewUrl('');
        alert('Logo atualizada com sucesso!');
      } else {
        throw new Error('Falha no upload da logo');
      }
    } catch (error) {
      console.error("Erro ao salvar logo:", error);
      alert('Erro ao salvar a logo.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin')} className={styles.botaoVoltar} title="Voltar ao Painel">
          <FaArrowLeft />
        </button>
        <h2>Gerenciar Logos</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.cardUpload}>
          <h3>Logo do Site</h3>
          <p>Faça o upload de uma nova imagem para a marca. Recomendado: fundo transparente (PNG).</p>
          <div 
            className={styles.dropzone}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept="image/png, image/jpeg, image/svg+xml"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <FaUpload className={styles.uploadIcon} />
            {novaLogo ? (
              <span>Arquivo selecionado: {novaLogo.name}</span>
            ) : (
              <span>Arraste uma imagem ou clique para selecionar</span>
            )}
          </div>
          <button 
            className={styles.salvarButton} 
            onClick={handleSalvar}
            disabled={!novaLogo}
          >
            Salvar Nova Logo
          </button>
        </div>

        <div className={styles.cardPreview}>
          <h3><FaPalette /> Pré-visualização</h3>
          <p>Veja como sua logo aparecerá em diferentes fundos.</p>
          <div className={styles.previewArea}>
            <div className={`${styles.previewBox} ${styles.previewDark}`}>
              <img src={previewUrl || logoUrl} alt="Preview em fundo escuro" />
              <span>Fundo Escuro</span>
            </div>
            <div className={`${styles.previewBox} ${styles.previewLight}`}>
              <img src={previewUrl || logoUrl} alt="Preview em fundo claro" />
              <span>Fundo Claro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GerenciarLogos;
