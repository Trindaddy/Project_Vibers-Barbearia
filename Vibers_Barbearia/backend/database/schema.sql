-- Apaga tabelas antigas (Cuidado em produção!)
DROP TABLE IF EXISTS agendamentos;
DROP TABLE IF EXISTS configuracoes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS barbearias;

-- 1. Tabela de Barbearias (Empresas)
CREATE TABLE IF NOT EXISTS barbearias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL, -- Ex: 'vibers', 'cortes-finos' (usado na URL)
  endereco TEXT,
  modelo_agendamento VARCHAR(20) DEFAULT 'fila', -- 'hora_marcada' ou 'fila'
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Usuários (Clientes e Donos)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'cliente', -- 'admin_geral', 'dono_barbearia', 'cliente'
  barbearia_id INT REFERENCES barbearias(id), -- Se for dono, qual barbearia ele gerencia?
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Configurações (Por Barbearia)
CREATE TABLE IF NOT EXISTS configuracoes (
  id SERIAL PRIMARY KEY,
  barbearia_id INT REFERENCES barbearias(id) ON DELETE CASCADE,
  chave VARCHAR(50) NOT NULL,
  valor JSON NOT NULL,
  UNIQUE(barbearia_id, chave)
);

-- 4. Tabela de Agendamentos / Fila
CREATE TABLE IF NOT EXISTS agendamentos (
  id SERIAL PRIMARY KEY,
  barbearia_id INT REFERENCES barbearias(id) ON DELETE CASCADE,
  cliente_id INT REFERENCES usuarios(id), -- Pode ser NULL se for agendamento rápido sem cadastro
  nome_cliente VARCHAR(100) NOT NULL, -- Caso não tenha cadastro
  telefone_cliente VARCHAR(20),
  data DATE NOT NULL,
  horario TIME, -- Pode ser NULL se for 'fila'
  posicao_fila INT, -- Usado apenas se for 'fila'
  status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'confirmado', 'em_atendimento', 'concluido', 'cancelado'
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dados Iniciais de Exemplo (Seed)
INSERT INTO barbearias (nome, slug, modelo_agendamento) VALUES 
('Vibers Barbearia', 'vibers', 'hora_marcada');

-- Inserir configurações para a Vibers
INSERT INTO configuracoes (barbearia_id, chave, valor) VALUES
(1, 'horarios', '{"semana": {"inicio": "08:00", "fim": "20:00"}, "sabado": {"inicio": "08:00", "fim": "13:00"}, "domingo": {"inicio": "08:00", "fim": "13:00"}}'::json),
(1, 'logo_url', '"/uploads/default_logo.svg"'::json);