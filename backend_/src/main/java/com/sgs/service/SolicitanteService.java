package com.sgs.service;

import com.sgs.dto.SolicitanteDTO;
import com.sgs.exception.BusinessException;
import com.sgs.exception.ResourceNotFoundException;
import com.sgs.model.Solicitante;
import com.sgs.repository.SolicitanteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitanteService {

    private final SolicitanteRepository repository;

    public SolicitanteService(SolicitanteRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<SolicitanteDTO> listar() {
        return repository.findAll().stream()
                .map(s -> new SolicitanteDTO(s.getId(), s.getNome(), s.getCpfCnpj()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SolicitanteDTO buscar(Long id) {
        Solicitante s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitante", id));
        return new SolicitanteDTO(s.getId(), s.getNome(), s.getCpfCnpj());
    }

    @Transactional
    public SolicitanteDTO criar(SolicitanteDTO dto) {
        if (repository.existsByCpfCnpj(dto.getCpfCnpj())) {
            throw new BusinessException("Já existe um solicitante com o CPF/CNPJ informado.");
        }
        Solicitante s = new Solicitante();
        s.setNome(dto.getNome());
        s.setCpfCnpj(dto.getCpfCnpj());
        Solicitante saved = repository.save(s);
        return new SolicitanteDTO(saved.getId(), saved.getNome(), saved.getCpfCnpj());
    }
}
