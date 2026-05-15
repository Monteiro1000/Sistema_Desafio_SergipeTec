package com.sgs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "solicitacao")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "solicitante_id", nullable = false)
    private Solicitante solicitante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    @Column(nullable = false, length = 500)
    private String descricao;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Digits(integer = 10, fraction = 2, message = "Valor inválido")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDate dataSolicitacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusSolicitacao status;

    @PrePersist
    protected void prePersist() {
        if (this.dataSolicitacao == null) {
            this.dataSolicitacao = LocalDate.now();
        }
        if (this.status == null) {
            this.status = StatusSolicitacao.SOLICITADO;
        }
    }

    public Solicitacao() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Solicitante getSolicitante() { return solicitante; }
    public void setSolicitante(Solicitante solicitante) { this.solicitante = solicitante; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public LocalDate getDataSolicitacao() { return dataSolicitacao; }
    public void setDataSolicitacao(LocalDate dataSolicitacao) { this.dataSolicitacao = dataSolicitacao; }

    public StatusSolicitacao getStatus() { return status; }
    public void setStatus(StatusSolicitacao status) { this.status = status; }
}
