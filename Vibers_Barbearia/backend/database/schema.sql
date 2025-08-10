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

-- CORREÇÃO: Apaga a tabela de usuários existente para garantir uma recriação limpa
DROP TABLE IF EXISTS usuarios;

-- Tabela de usuários
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

-- Usuário admin padrão com senha 'admin123'
INSERT IGNORE INTO usuarios (id, username, password_hash, role) VALUES
(1, 'admin', 'pbkdf2:sha256:600000$jT9zZ9bY8n6fL2sT$e425a1f6a3372e965251a3a7852b8e05a113d78c3b421c997b68a20f901e13cf', 'admin');

-- Seu usuário pessoal com senha 'Trindade@21'
INSERT IGNORE INTO usuarios (id, username, password_hash, role) VALUES
(2, 'trindade', 'pbkdf2:sha256:600000$cWJtN1gO8xL5qE2R$e5a5932550a252c72b1551061911a47d950116813425816e13d1052e4ab693b1', 'admin');
