import React, { createContext, useContext, useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({ logoUrl: '' });
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/configuracoes/public`);
      const data = await res.json();
      const logoPath = data.logo_url || '';
      setConfig({ logoUrl: `${API_BASE}${logoPath}` });
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateLogoUrl = (newUrl) => {
    setConfig((prevConfig) => ({ ...prevConfig, logoUrl: newUrl }));
  };

  const value = { ...config, loading, updateLogoUrl };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);

