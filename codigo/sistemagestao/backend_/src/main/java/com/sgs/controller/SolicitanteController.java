package com.sgs.controller;

import com.sgs.dto.SolicitanteDTO;
import com.sgs.service.SolicitanteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitantes")
public class SolicitanteController {

    private final SolicitanteService service;

    public SolicitanteController(SolicitanteService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SolicitanteDTO>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitanteDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscar(id));
    }

    @PostMapping
    public ResponseEntity<SolicitanteDTO> criar(@Valid @RequestBody SolicitanteDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }
}
