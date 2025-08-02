// AdminPainel/GerenciarLogos.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaPalette } from 'react-icons/fa';
import styles from './GerenciarLogos.module.css';

const GerenciarLogos = () => {
  const navigate = useNavigate();
  const [logoAtual, setLogoAtual] = useState('https://placehold.co/200x100/f2c12e/121212?text=Viber\'s');
  const [novaLogo, setNovaLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNovaLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSalvar = () => {
    // Em um projeto real, aqui você faria o upload do 'novaLogo' para o servidor
    // e atualizaria a URL da 'logoAtual' com a resposta do servidor.
    if (previewUrl) {
      setLogoAtual(previewUrl);
      setNovaLogo(null);
      setPreviewUrl('');
      alert('Logo atualizada com sucesso!'); // Usando alert para simplicidade
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
              <img src={previewUrl || logoAtual} alt="Preview em fundo escuro" />
              <span>Fundo Escuro</span>
            </div>
            <div className={`${styles.previewBox} ${styles.previewLight}`}>
              <img src={previewUrl || logoAtual} alt="Preview em fundo claro" />
              <span>Fundo Claro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GerenciarLogos;
