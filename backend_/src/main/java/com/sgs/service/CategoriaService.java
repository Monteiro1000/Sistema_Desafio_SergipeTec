package com.sgs.service;

import com.sgs.dto.CategoriaDTO;
import com.sgs.exception.ResourceNotFoundException;
import com.sgs.model.Categoria;
import com.sgs.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaDTO> listar() {
        return repository.findAll().stream()
                .map(c -> new CategoriaDTO(c.getId(), c.getNome()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoriaDTO buscar(Long id) {
        Categoria c = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));
        return new CategoriaDTO(c.getId(), c.getNome());
    }
}
