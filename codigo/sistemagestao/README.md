# SGS — Sistema de Gestão de Solicitações

Olá, me chamo Júlio Monteiro e sou desenvolvedor front-end com o foco de melhorar minhas aplicações e desenvolver full-stack! Este repositório contém uma aplicação simples para registrar, acompanhar e gerenciar solicitações dentro de uma organização. Foi implementada como parte de um desafio técnico, mas está pronta para ser executada localmente e servir como base para melhorias.

---

## Sumário rápido

- Visão geral e propósito
- Como rodar localmente (backend + frontend)
- Como preparar o banco de dados
- Endpoints principais e regras de negócio

Se quiser apenas executar a aplicação, siga a seção "Executando localmente" abaixo — é rápida.

---

## Visão Geral

O SGS permite criar solicitações (ex.: pedidos de pagamento), acompanhar seus status e consultar histórico. O backend controla as transições de status para garantir que o fluxo seja consistente com as regras definidas.

Este projeto foi organizado com camadas claras (controller, service, repository) para facilitar leitura e testes.

---

## Tecnologias

- Backend: Java 21, Spring Boot 3.2
- Banco: PostgreSQL 15+
- Frontend: React 18 com Vite
- Build: Maven

---

## Requisitos básicos

- Java 21+
- Maven 3.9+
- PostgreSQL 15+
- Node.js 20+ (para o frontend)

---

## Executando localmente (rápido)

1. Prepare o banco (veja a próxima seção).
2. Backend:

```bash
cd backend
mvn clean package -DskipTests
java -jar target/sgs-backend-1.0.0.jar
```

ou, em ambiente de desenvolvimento:

```bash
mvn -f backend spring-boot:run
```

API por padrão: http://localhost:8080

3. Frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend por padrão: http://localhost:5173

Observação: o Vite já está configurado para proxiar chamadas a `/api` para `http://localhost:8080` durante o desenvolvimento.

---

## Banco de dados — preparação rápida

1) Crie o banco:

```sql
CREATE DATABASE sgs_db;
```

2) Rode os scripts SQL:

```bash
psql -U postgres -d sgs_db -f sql/ddl.sql
psql -U postgres -d sgs_db -f sql/dml.sql
```

Os scripts criam as tabelas e inserem dados de exemplo (categorias, solicitantes e algumas solicitações).

Configuração de conexão (arquivo `application.properties` em `backend/src/main/resources`):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sgs_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Altere usuário/senha conforme seu ambiente local.

---

## Endpoints principais (resumo)

Solicitações:
- POST  /api/solicitacoes        — criar
- GET   /api/solicitacoes        — listar (com filtros)
- GET   /api/solicitacoes/{id}   — detalhe
- PATCH /api/solicitacoes/{id}/status — atualizar status

Categorias:
- GET /api/categorias

Solicitantes:
- GET /api/solicitantes
- POST /api/solicitantes

Exemplo de body para criar solicitação:

```json
{
    "solicitanteId": 1,
    "categoriaId": 2,
    "descricao": "Compra de materiais",
    "valor": 1250.00
}
```

Filtro típico na listagem:

`?status=SOLICITADO&categoriaId=2&dataInicio=2026-01-01&dataFim=2026-12-31`

---

## Regras de negócio (fluxo de status)

Estados principais: SOLICITADO → LIBERADO → APROVADO → CANCELADO
Pode também transitar para REJEITADO (estado final) a partir de SOLICITADO ou LIBERADO.

As regras de transição estão implementadas em `StatusSolicitacao` e validadas no `SolicitacaoService`. Transições inválidas retornam HTTP 422 com mensagem clara.

---

## Algumas escolhas

- PostgreSQL: escolha por confiabilidade e suporte a constraints necessárias.
- `ddl-auto=validate`: exige scripts SQL explícitos para controle do schema em produção.
- A listagem principal usa query nativa para manter controle fino sobre joins e filtros.
- Tratamento de erros centralizado via `GlobalExceptionHandler` para respostas consistentes.

---

## Histórico e contribuições

O repositório usa branches por feature e merges explícitos. Se quiser contribuir, abra uma branch a partir de `main`, faça commits pequenos e crie um pull request com descrição curta das mudanças.

---