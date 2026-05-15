package com.sgs.service;

import com.sgs.dto.SolicitacaoDTO;
import com.sgs.exception.BusinessException;
import com.sgs.exception.ResourceNotFoundException;
import com.sgs.model.*;
import com.sgs.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final SolicitanteRepository solicitanteRepository;
    private final CategoriaRepository   categoriaRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
                              SolicitanteRepository solicitanteRepository,
                              CategoriaRepository   categoriaRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.solicitanteRepository = solicitanteRepository;
        this.categoriaRepository   = categoriaRepository;
    }

    // ── Criar solicitação ────────────────────────────────────────────────────
    @Transactional
    public SolicitacaoDTO.Response criar(SolicitacaoDTO dto) {
        Solicitante solicitante = solicitanteRepository.findById(dto.getSolicitanteId())
                .orElseThrow(() -> new ResourceNotFoundException("Solicitante", dto.getSolicitanteId()));

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", dto.getCategoriaId()));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setSolicitante(solicitante);
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricao(dto.getDescricao());
        solicitacao.setValor(dto.getValor());
        // status e data são definidos via @PrePersist

        Solicitacao salva = solicitacaoRepository.save(solicitacao);
        return toResponse(salva);
    }

    // ── Listar com filtros (SQL nativo) ──────────────────────────────────────
    @Transactional(readOnly = true)
    public List<SolicitacaoDTO.Response> listar(SolicitacaoDTO.FiltroRequest filtro) {
        String status      = filtro.getStatus()      != null ? filtro.getStatus().name() : null;
        Long   categoriaId = filtro.getCategoriaId();
        String dataInicio  = filtro.getDataInicio()  != null ? filtro.getDataInicio().toString()  : null;
        String dataFim     = filtro.getDataFim()     != null ? filtro.getDataFim().toString()     : null;

        List<Object[]> rows = solicitacaoRepository.listarComFiltros(status, categoriaId, dataInicio, dataFim);
        return rows.stream().map(this::mapRow).collect(Collectors.toList());
    }

    // ── Detalhar solicitação ─────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public SolicitacaoDTO.Response detalhar(Long id) {
        Solicitacao s = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação", id));
        return toResponse(s);
    }

    // ── Atualizar status ─────────────────────────────────────────────────────
    @Transactional
    public SolicitacaoDTO.Response atualizarStatus(Long id, StatusSolicitacao novoStatus) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação", id));

        StatusSolicitacao statusAtual = solicitacao.getStatus();

        if (statusAtual.isFinal()) {
            throw new BusinessException(
                    "Solicitação com status " + statusAtual + " é um estado final e não pode ser alterada.");
        }

        if (!statusAtual.podeTransicionarPara(novoStatus)) {
            throw new BusinessException(
                    "Transição de " + statusAtual + " para " + novoStatus + " não é permitida. " +
                    "Transições válidas: " + statusAtual.transicoesPermitidas());
        }

        solicitacao.setStatus(novoStatus);
        return toResponse(solicitacaoRepository.save(solicitacao));
    }

    // ── Mappers ──────────────────────────────────────────────────────────────

    private SolicitacaoDTO.Response toResponse(Solicitacao s) {
        SolicitacaoDTO.Response r = new SolicitacaoDTO.Response();
        r.setId(s.getId());
        r.setNomeSolicitante(s.getSolicitante().getNome());
        r.setCpfCnpjSolicitante(s.getSolicitante().getCpfCnpj());
        r.setNomeCategoria(s.getCategoria().getNome());
        r.setDescricao(s.getDescricao());
        r.setValor(s.getValor());
        r.setDataSolicitacao(s.getDataSolicitacao());
        r.setStatus(s.getStatus());
        return r;
    }

    /**
     * Mapeia uma linha do resultado da query nativa para o DTO de resposta.
     * Índices devem seguir a ordem do SELECT:
     *   0=id, 1=nome_sol, 2=cpfCnpj, 3=nome_cat, 4=descricao, 5=valor,
     *   6=data_solicitacao, 7=status
     */
    private SolicitacaoDTO.Response mapRow(Object[] row) {
        SolicitacaoDTO.Response r = new SolicitacaoDTO.Response();
        r.setId(((Number) row[0]).longValue());
        r.setNomeSolicitante((String) row[1]);
        r.setCpfCnpjSolicitante((String) row[2]);
        r.setNomeCategoria((String) row[3]);
        r.setDescricao((String) row[4]);
        r.setValor((BigDecimal) row[5]);
        r.setDataSolicitacao(row[6] instanceof LocalDate
                ? (LocalDate) row[6]
                : LocalDate.parse(row[6].toString()));
        r.setStatus(StatusSolicitacao.valueOf((String) row[7]));
        return r;
    }
}
