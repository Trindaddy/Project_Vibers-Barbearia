CREATE DATABASE IF NOT EXISTS vibers_barbearia;
USE vibers_barbearia;

CREATE TABLE IF NOT EXISTS agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sobrenome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  unidade INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS configuracoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(50) UNIQUE NOT NULL,
  valor JSON NOT NULL
);

-- Apaga a tabela de usuários existente para garantir uma recriação limpa
DROP TABLE IF EXISTS usuarios;

-- Tabela de usuários (sem inserções de dados)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin'
);

INSERT IGNORE INTO configuracoes (chave, valor) VALUES
('horarios', '{"semana": {"inicio": "08:00", "fim": "20:00"}, "sabado": {"inicio": "08:00", "fim": "13:00"}}'),
('datas_bloqueadas', '["2025-12-25", "2026-01-01"]'),
('logo_url', '"/uploads/default_logo.svg"');
