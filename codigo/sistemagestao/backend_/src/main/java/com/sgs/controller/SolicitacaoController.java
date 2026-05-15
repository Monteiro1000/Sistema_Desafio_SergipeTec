package com.sgs.controller;

import com.sgs.dto.SolicitacaoDTO;
import com.sgs.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService service;

    public SolicitacaoController(SolicitacaoService service) {
        this.service = service;
    }

    /** POST /api/solicitacoes — Cadastrar nova solicitação */
    @PostMapping
    public ResponseEntity<SolicitacaoDTO.Response> criar(@Valid @RequestBody SolicitacaoDTO dto) {
        SolicitacaoDTO.Response response = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/solicitacoes — Listar com filtros opcionais.
     *   ?status=SOLICITADO
     *   &categoriaId=2
     *   &dataInicio=2024-01-01
     *   &dataFim=2024-12-31
     */
    @GetMapping
    public ResponseEntity<List<SolicitacaoDTO.Response>> listar(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {
        SolicitacaoDTO.FiltroRequest filtro = new SolicitacaoDTO.FiltroRequest();
        if (status != null && !status.isBlank()) {
            filtro.setStatus(com.sgs.model.StatusSolicitacao.valueOf(status.toUpperCase()));
        }
        filtro.setCategoriaId(categoriaId);
        filtro.setDataInicio(dataInicio);
        filtro.setDataFim(dataFim);

        return ResponseEntity.ok(service.listar(filtro));
    }

    /** GET /api/solicitacoes/{id} — Detalhar uma solicitação */
    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoDTO.Response> detalhar(@PathVariable Long id) {
        return ResponseEntity.ok(service.detalhar(id));
    }

    /** PATCH /api/solicitacoes/{id}/status — Atualizar status */
    @PatchMapping("/{id}/status")
    public ResponseEntity<SolicitacaoDTO.Response> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody SolicitacaoDTO.AtualizarStatusRequest request) {
        return ResponseEntity.ok(service.atualizarStatus(id, request.getNovoStatus()));
    }
}
