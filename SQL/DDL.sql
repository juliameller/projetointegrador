CREATE TABLE usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  cpf CHAR(11) UNIQUE NOT NULL,
  email VARCHAR(30) NOT NULL,
  senha VARCHAR(100) NOT NULL
);

INSERT INTO "usuario" ("nome", "cpf", "email", "senha") 
VALUES 
  ('Admin', '12345678901', 'teste@teste.com', 'admin');

CREATE TABLE cliente (
  id_cliente SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  telefone VARCHAR(11) NOT NULL,
  cpf CHAR(11) UNIQUE NOT NULL,
  email VARCHAR(30),
  endereco VARCHAR(100) NOT NULL,
  veiculo VARCHAR(50) NOT NULL
);

INSERT INTO cliente (nome, telefone, cpf, email, endereco, veiculo) VALUES
('João da Silva', '11999990001', '12345678901', 'joao.silva@email.com', 'Av. Brasil, 1234 - São Paulo, SP', 'Scania R450'),
('Maria Oliveira', '21988887777', '23456789012', 'maria.oliveira@email.com', 'Rua das Flores, 456 - Rio de Janeiro, RJ', 'Volvo FH 540'),
('Carlos Santos', '31977776666', '34567890123', 'carlos.santos@email.com', 'Rua Afonso Pena, 321 - Belo Horizonte, MG', 'Mercedes-Benz Actros 2651'),
('Fernanda Souza', '41966665555', '45678901234', 'fernanda.souza@email.com', 'Av. Sete de Setembro, 789 - Curitiba, PR', 'DAF XF105'),
('José Almeida', '51955554444', '56789012345', 'jose.almeida@email.com', 'Rua Bento Gonçalves, 654 - Porto Alegre, RS', 'MAN TGX 29.480'),
('Paulo Rocha', '62944443333', '67890123456', 'paulo.rocha@email.com', 'Av. Goiás, 987 - Goiânia, GO', 'Iveco Hi-Way 600S44'),
('Ana Paula Lima', '71933332222', '78901234567', 'ana.lima@email.com', 'Rua da República, 111 - Salvador, BA', 'Scania R620'),
('Roberto Nunes', '81922221111', '89012345678', 'roberto.nunes@email.com', 'Av. Conde da Boa Vista, 222 - Recife, PE', 'Volvo VM 330'),
('Luciana Martins', '11911110000', '90123456789', 'luciana.martins@email.com', 'Rua Tatuapé, 333 - São Paulo, SP', 'Mercedes-Benz Axor 2544'),
('Bruno Ferreira', '21900009999', '01234567890', 'bruno.ferreira@email.com', 'Rua do Catete, 555 - Rio de Janeiro, RJ', 'Volkswagen Constellation 24.280');

CREATE TABLE servico (
  id_servico SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  valor NUMERIC(7,2) NOT NULL,
  duracao TIME NOT NULL
);

INSERT INTO servico (nome, valor, duracao) VALUES
('Troca de óleo do motor', 350.00, INTERVAL '01:00:00'),
('Revisão completa', 1200.00, INTERVAL '04:00:00'),
('Alinhamento e balanceamento', 400.00, INTERVAL '01:30:00'),
('Substituição de embreagem', 2500.00, INTERVAL '06:00:00'),
('Troca de pastilhas de freio', 600.00, INTERVAL '02:00:00'),
('Diagnóstico eletrônico', 300.00, INTERVAL '01:00:00');
-- ('Troca de filtro de ar e combustível', 450.00, INTERVAL '01:30:00'),
-- ('Manutenção do sistema de ar (freio pneumático)', 800.00, INTERVAL '03:00:00'),
-- ('Troca de amortecedores', 950.00, INTERVAL '02:30:00'),
-- ('Troca de correia dentada', 700.00, INTERVAL '02:00:00');

CREATE TABLE agenda (
  id_agenda SERIAL PRIMARY KEY,
  id_cliente INTEGER NOT NULL,
  data_inicial TIMESTAMP NOT NULL,
  data_final TIMESTAMP NOT NULL,
  status INTEGER NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
);

INSERT INTO agenda (id_cliente, data_inicial, data_final, status, observacoes) VALUES
(1, '2025-04-25 08:00:00', '2025-04-25 09:00:00', 1, NULL),
(2, '2025-04-25 09:30:00', '2025-04-25 15:30:00', 1, NULL),
(3, '2025-04-26 08:00:00', '2025-04-26 12:00:00', 1, NULL),
(4, '2025-04-26 13:00:00', '2025-04-26 15:00:00', 1, NULL),
(5, '2025-04-27 10:00:00', '2025-04-27 11:30:00', 1, NULL),
(6, '2025-04-28 09:00:00', '2025-04-28 10:00:00', 1, NULL),
(7, '2025-04-28 13:00:00', '2025-04-28 16:00:00', 1, NULL),
(8, '2025-04-29 08:00:00', '2025-04-29 09:30:00', 1, NULL),
(9, '2025-04-30 11:00:00', '2025-04-30 13:00:00', 1, NULL),
(10, '2025-05-02 10:00:00', '2025-05-02 12:30:00', 1, NULL);



CREATE TABLE agendamento_servicos (
    id_agenda BIGINT NOT NULL,
    id_servico BIGINT NOT NULL,
    PRIMARY KEY (id_agenda, id_servico),
    CONSTRAINT fk_agenda FOREIGN KEY (id_agenda) REFERENCES agenda(id_agenda),
    CONSTRAINT fk_servico FOREIGN KEY (id_servico) REFERENCES servico(id_servico)
);

INSERT INTO agendamento_servicos (id_agenda, id_servico) VALUES
(1, 1),
(2, 4),
(3, 2),
(4, 5),
(5, 3),
(6, 6),
(7, 2),
(8, 1),
(9, 5),
(10, 6);
