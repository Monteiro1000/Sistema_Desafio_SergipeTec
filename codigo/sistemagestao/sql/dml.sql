-- ── Categorias (mínimo 5) 
INSERT INTO categoria (nome) VALUES
    ('Serviços'),
    ('Material'),
    ('Transporte'),
    ('Tecnologia'),
    ('Treinamento');

-- ── Solicitantes (mínimo 5) 
INSERT INTO solicitante (nome, cpf_cnpj) VALUES
    ('Ana Paula Ferreira',     '123.456.789-00'),
    ('Carlos Eduardo Lima',    '987.654.321-11'),
    ('Fernanda Souza Costa',   '11.222.333/0001-44'),
    ('Roberto Mendes Alves',   '555.666.777-88'),
    ('Juliana Oliveira Santos','999.888.777-66');

-- ── Solicitações de exemplo 
INSERT INTO solicitacao (solicitante_id, categoria_id, descricao, valor, data_solicitacao, status) VALUES
    (1, 1, 'Contratação de serviço de limpeza predial mensal',      1500.00, '2026-04-01', 'SOLICITADO'),
    (2, 2, 'Compra de material de escritório para o setor TI',       890.50, '2026-04-05', 'LIBERADO'),
    (3, 3, 'Fretamento de ônibus para evento corporativo',          3200.00, '2026-04-08', 'APROVADO'),
    (4, 4, 'Renovação de licenças de software Adobe Creative',      4750.00, '2026-04-10', 'REJEITADO'),
    (5, 5, 'Inscrição em curso de capacitação em gestão de projetos', 600.00, '2026-04-12', 'CANCELADO'),
    (1, 4, 'Aquisição de notebooks para equipe de desenvolvimento', 18900.00, '2026-04-15', 'SOLICITADO'),
    (2, 1, 'Manutenção preventiva dos equipamentos de ar condicionado', 2100.00, '2026-04-18', 'LIBERADO'),
    (3, 2, 'Compra de cartuchos e tonners para impressoras',         430.00, '2026-04-20', 'SOLICITADO');