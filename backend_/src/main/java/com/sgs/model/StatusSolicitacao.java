package com.sgs.model;

import java.util.Set;
import java.util.EnumSet;

public enum StatusSolicitacao {

    SOLICITADO {
        @Override
        public Set<StatusSolicitacao> transicoesPermitidas() {
            return EnumSet.of(LIBERADO, REJEITADO);
        }
    },
    LIBERADO {
        @Override
        public Set<StatusSolicitacao> transicoesPermitidas() {
            return EnumSet.of(APROVADO, REJEITADO);
        }
    },
    APROVADO {
        @Override
        public Set<StatusSolicitacao> transicoesPermitidas() {
            return EnumSet.of(CANCELADO);
        }
    },
    REJEITADO {
        @Override
        public Set<StatusSolicitacao> transicoesPermitidas() {
            return EnumSet.noneOf(StatusSolicitacao.class);
        }
    },
    CANCELADO {
        @Override
        public Set<StatusSolicitacao> transicoesPermitidas() {
            return EnumSet.noneOf(StatusSolicitacao.class);
        }
    };

    public abstract Set<StatusSolicitacao> transicoesPermitidas();

    public boolean podeTransicionarPara(StatusSolicitacao novoStatus) {
        return transicoesPermitidas().contains(novoStatus);
    }

    public boolean isFinal() {
        return transicoesPermitidas().isEmpty();
    }
}
