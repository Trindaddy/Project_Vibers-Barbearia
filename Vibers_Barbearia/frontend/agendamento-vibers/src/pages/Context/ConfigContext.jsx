// src/context/ConfigContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const API_BASE = "http://localhost:5000";

// 1. Cria o Contexto
const ConfigContext = createContext();

// 2. Cria o "Provedor" do Contexto
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    logoUrl: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/configuracoes`);
      const data = await res.json();
      
      // --- CORREÇÃO AQUI ---
      // O backend já nos envia o valor como uma string normal, então o JSON.parse não é necessário.
      const logoPath = data.logo_url || ''; 
      
      setConfig({
        logoUrl: `${API_BASE}${logoPath}`
      });
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Função para atualizar a logo a partir de outros componentes
  const updateLogoUrl = (newUrl) => {
    setConfig(prevConfig => ({ ...prevConfig, logoUrl: newUrl }));
  };

  const value = {
    ...config,
    loading,
    updateLogoUrl,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

// 3. Cria um hook customizado para facilitar o uso do contexto
export const useConfig = () => {
  return useContext(ConfigContext);
};
