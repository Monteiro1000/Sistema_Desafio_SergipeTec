package com.sgs.dto;

import com.sgs.model.StatusSolicitacao;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

// ── Request: criar solicitação ──────────────────────────────────────────────
public class SolicitacaoDTO {

    @NotNull(message = "Solicitante é obrigatório")
    private Long solicitanteId;

    @NotNull(message = "Categoria é obrigatória")
    private Long categoriaId;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 500)
    private String descricao;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    public Long getSolicitanteId() { return solicitanteId; }
    public void setSolicitanteId(Long solicitanteId) { this.solicitanteId = solicitanteId; }

    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    // ── Response: listagem / detalhe ─────────────────────────────────────────
    public static class Response {
        private Long id;
        private String nomeSolicitante;
        private String cpfCnpjSolicitante;
        private String nomeCategoria;
        private String descricao;
        private BigDecimal valor;
        private LocalDate dataSolicitacao;
        private StatusSolicitacao status;

        public Response() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNomeSolicitante() { return nomeSolicitante; }
        public void setNomeSolicitante(String nomeSolicitante) { this.nomeSolicitante = nomeSolicitante; }

        public String getCpfCnpjSolicitante() { return cpfCnpjSolicitante; }
        public void setCpfCnpjSolicitante(String cpfCnpjSolicitante) { this.cpfCnpjSolicitante = cpfCnpjSolicitante; }

        public String getNomeCategoria() { return nomeCategoria; }
        public void setNomeCategoria(String nomeCategoria) { this.nomeCategoria = nomeCategoria; }

        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }

        public BigDecimal getValor() { return valor; }
        public void setValor(BigDecimal valor) { this.valor = valor; }

        public LocalDate getDataSolicitacao() { return dataSolicitacao; }
        public void setDataSolicitacao(LocalDate dataSolicitacao) { this.dataSolicitacao = dataSolicitacao; }

        public StatusSolicitacao getStatus() { return status; }
        public void setStatus(StatusSolicitacao status) { this.status = status; }
    }

    // ── Request: atualizar status ────────────────────────────────────────────
    public static class AtualizarStatusRequest {

        @NotNull(message = "Novo status é obrigatório")
        private StatusSolicitacao novoStatus;

        public StatusSolicitacao getNovoStatus() { return novoStatus; }
        public void setNovoStatus(StatusSolicitacao novoStatus) { this.novoStatus = novoStatus; }
    }

    // ── Request: filtros de listagem ─────────────────────────────────────────
    public static class FiltroRequest {
        private StatusSolicitacao status;
        private Long categoriaId;
        private LocalDate dataInicio;
        private LocalDate dataFim;

        public StatusSolicitacao getStatus() { return status; }
        public void setStatus(StatusSolicitacao status) { this.status = status; }

        public Long getCategoriaId() { return categoriaId; }
        public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }

        public LocalDate getDataInicio() { return dataInicio; }
        public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

        public LocalDate getDataFim() { return dataFim; }
        public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
    }
}
