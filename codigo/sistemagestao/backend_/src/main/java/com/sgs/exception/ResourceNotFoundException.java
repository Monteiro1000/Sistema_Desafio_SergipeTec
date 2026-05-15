package com.sgs.exception;

// ── Recurso não encontrado ───────────────────────────────────────────────────
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String entity, Long id) {
        super(entity + " com id " + id + " não encontrado(a).");
    }
}
