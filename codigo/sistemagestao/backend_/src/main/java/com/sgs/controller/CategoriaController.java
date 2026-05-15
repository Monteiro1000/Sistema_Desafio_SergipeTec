package com.sgs.controller;

import com.sgs.dto.CategoriaDTO;
import com.sgs.service.CategoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscar(id));
    }
}
