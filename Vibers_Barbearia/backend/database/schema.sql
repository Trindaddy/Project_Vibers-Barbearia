-- Cria o banco de dados se ele ainda não existir
CREATE DATABASE IF NOT EXISTS vibers_barbearia;

-- Seleciona o banco de dados para usar
USE vibers_barbearia;

-- Apaga as tabelas existentes para garantir uma recriação limpa do zero
DROP TABLE IF EXISTS agendamentos;
DROP TABLE IF EXISTS configuracoes;
DROP TABLE IF EXISTS usuarios;

-- Cria a tabela de agendamentos com a estrutura final correta
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

-- Cria a tabela de configurações
CREATE TABLE IF NOT EXISTS configuracoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(50) UNIQUE NOT NULL,
  valor JSON NOT NULL
);

-- Cria a tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin'
);

-- Insere as configurações padrão essenciais para a aplicação funcionar
INSERT IGNORE INTO configuracoes (chave, valor) VALUES
('horarios', '{"semana": {"inicio": "08:00", "fim": "20:00"}, "sabado": {"inicio": "08:00", "fim": "13:00"}}'),
('datas_bloqueadas', '["2025-12-25", "2026-01-01"]'),
('logo_url', '"/uploads/default_logo.svg"');
