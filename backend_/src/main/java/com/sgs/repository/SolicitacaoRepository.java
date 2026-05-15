package com.sgs.repository;

import com.sgs.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    /**
     * SQL NATIVO — listagem principal com JOIN e filtros dinâmicos.
     *
     * Cada parâmetro é opcional: quando nulo, a cláusula é ignorada via
     * COALESCE / IS NULL, evitando N combinações de método.
     */
    @Query(value = """
            SELECT
                s.id,
                sol.nome        AS nome_solicitante,
                sol.cpf_cnpj    AS cpf_cnpj_solicitante,
                cat.nome        AS nome_categoria,
                s.descricao,
                s.valor,
                s.data_solicitacao,
                s.status
            FROM solicitacao s
            INNER JOIN solicitante sol ON sol.id = s.solicitante_id
            INNER JOIN categoria    cat ON cat.id = s.categoria_id
            WHERE
                (:status     IS NULL OR s.status       = :status)
                AND (:categoriaId IS NULL OR s.categoria_id = :categoriaId)
                AND (:dataInicio  IS NULL OR s.data_solicitacao >= CAST(:dataInicio AS DATE))
                AND (:dataFim     IS NULL OR s.data_solicitacao <= CAST(:dataFim    AS DATE))
            ORDER BY s.data_solicitacao DESC, s.id DESC
            """,
            nativeQuery = true)
    List<Object[]> listarComFiltros(
            @Param("status")      String status,
            @Param("categoriaId") Long   categoriaId,
            @Param("dataInicio")  String dataInicio,
            @Param("dataFim")     String dataFim
    );
}
