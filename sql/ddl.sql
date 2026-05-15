DROP TABLE IF EXISTS solicitacao  CASCADE;
DROP TABLE IF EXISTS solicitante  CASCADE;
DROP TABLE IF EXISTS categoria    CASCADE;

-- ── Solicitante 
CREATE TABLE solicitante (
    id       BIGSERIAL    PRIMARY KEY,
    nome     VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(18)  NOT NULL UNIQUE
);

-- ── Categoria 
CREATE TABLE categoria (
    id   BIGSERIAL    PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- ── Solicitação
CREATE TABLE solicitacao (
    id               BIGSERIAL      PRIMARY KEY,
    solicitante_id   BIGINT         NOT NULL,
    categoria_id     BIGINT         NOT NULL,
    descricao        VARCHAR(500)   NOT NULL,
    valor            NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
    data_solicitacao DATE           NOT NULL DEFAULT CURRENT_DATE,
    status           VARCHAR(20)    NOT NULL DEFAULT 'SOLICITADO'
        CHECK (status IN ('SOLICITADO','LIBERADO','APROVADO','REJEITADO','CANCELADO'),

    CONSTRAINT fk_solicitacao_solicitante FOREIGN KEY (solicitante_id) REFERENCES solicitante (id),
    CONSTRAINT fk_solicitacao_categoria   FOREIGN KEY (categoria_id)   REFERENCES categoria   (id)
);

-- ── Índices auxiliares 
CREATE INDEX idx_solicitacao_status       ON solicitacao (status);
CREATE INDEX idx_solicitacao_categoria_id ON solicitacao (categoria_id);
CREATE INDEX idx_solicitacao_data         ON solicitacao (data_solicitacao);