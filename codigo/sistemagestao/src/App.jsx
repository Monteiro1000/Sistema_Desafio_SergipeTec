import { useState, useEffect, useCallback } from "react";

//Mock API (substitui axios quando for rodar fora do backend)

const mockDb = {
  categorias: [
    { id: 1, nome: "Serviços" },
    { id: 2, nome: "Material" },
    { id: 3, nome: "Transporte" },
    { id: 4, nome: "Tecnologia" },
    { id: 5, nome: "Treinamento" },
  ],
  solicitantes: [
    { id: 1, nome: "Ana Paula Ferreira",     cpfCnpj: "123.456.789-00" },
    { id: 2, nome: "Carlos Eduardo Lima",    cpfCnpj: "987.654.321-11" },
    { id: 3, nome: "Fernanda Souza Costa",   cpfCnpj: "11.222.333/0001-44" },
    { id: 4, nome: "Roberto Mendes Alves",   cpfCnpj: "555.666.777-88" },
    { id: 5, nome: "Juliana Oliveira Santos",cpfCnpj: "999.888.777-66" },
  ],
  solicitacoes: [
    { id: 1, solicitanteId: 1, categoriaId: 1, descricao: "Contratação de serviço de limpeza predial mensal",        valor: 1500.00, dataSolicitacao: "2026-04-01", status: "SOLICITADO"  },
    { id: 2, solicitanteId: 2, categoriaId: 2, descricao: "Compra de material de escritório para o setor TI",         valor:  890.50, dataSolicitacao: "2026-04-05", status: "LIBERADO"   },
    { id: 3, solicitanteId: 3, categoriaId: 3, descricao: "Fretamento de ônibus para evento corporativo",            valor: 3200.00, dataSolicitacao: "2026-04-08", status: "APROVADO"   },
    { id: 4, solicitanteId: 4, categoriaId: 4, descricao: "Renovação de licenças de software Adobe Creative",        valor: 4750.00, dataSolicitacao: "2026-04-10", status: "REJEITADO"  },
    { id: 5, solicitanteId: 5, categoriaId: 5, descricao: "Inscrição em curso de capacitação em gestão de projetos", valor:  600.00, dataSolicitacao: "2026-04-12", status: "CANCELADO"  },
    { id: 6, solicitanteId: 1, categoriaId: 4, descricao: "Aquisição de notebooks para equipe de desenvolvimento",  valor:18900.00, dataSolicitacao: "2026-04-15", status: "SOLICITADO"  },
    { id: 7, solicitanteId: 2, categoriaId: 1, descricao: "Manutenção preventiva dos ar-condicionados",              valor: 2100.00, dataSolicitacao: "2026-04-18", status: "LIBERADO"   },
    { id: 8, solicitanteId: 3, categoriaId: 2, descricao: "Compra de cartuchos e tonners para impressoras",          valor:  430.00, dataSolicitacao: "2026-04-20", status: "SOLICITADO"  },
  ],
  nextId: 9,
};

const TRANSITIONS = {
  SOLICITADO: ["LIBERADO", "REJEITADO"],
  LIBERADO:   ["APROVADO", "REJEITADO"],
  APROVADO:   ["CANCELADO"],
  REJEITADO:  [],
  CANCELADO:  [],
};

function status(s) {
  const sol = mockDb.solicitantes.find(x => x.id === s.solicitanteId) || {};
  const cat = mockDb.categorias.find(x => x.id === s.categoriaId) || {};
  return {
    id: s.id, descricao: s.descricao, valor: s.valor,
    dataSolicitacao: s.dataSolicitacao, status: s.status,
    nomeSolicitante: sol.nome, cpfCnpjSolicitante: sol.cpfCnpj,
    nomeCategoria: cat.nome,
  };
}

const mockAPI = {
  listarSolicitacoes: (filtros = {}) => {
    let list = mockDb.solicitacoes.slice();
    if (filtros.status)      list = list.filter(s => s.status === filtros.status);
    if (filtros.categoriaId) list = list.filter(s => s.categoriaId === Number(filtros.categoriaId));
    if (filtros.dataInicio)  list = list.filter(s => s.dataSolicitacao >= filtros.dataInicio);
    if (filtros.dataFim)     list = list.filter(s => s.dataSolicitacao <= filtros.dataFim);
    return list.map(enrich);
  },
  detalhar: (id) => {
    const s = mockDb.solicitacoes.find(x => x.id === Number(id));
    if (!s) throw new Error("Solicitação não encontrada");
    return enrich(s);
  },
  criar: (dto) => {
    const nova = { ...dto, id: mockDb.nextId++, dataSolicitacao: new Date().toISOString().slice(0,10), status: "SOLICITADO" };
    mockDb.solicitacoes.push(nova);
    return enrich(nova);
  },
  atualizarStatus: (id, novoStatus) => {
    const s = mockDb.solicitacoes.find(x => x.id === Number(id));
    if (!s) throw new Error("Solicitação não encontrada");
    const permitidos = TRANSITIONS[s.status] || [];
    if (!permitidos.includes(novoStatus)) throw new Error(`Transição ${s.status} → ${novoStatus} não permitida.`);
    s.status = novoStatus;
    return enrich(s);
  },
};

//Parte visual

const STATUS_META = {
  SOLICITADO: { label: "Solicitado", color: "#3B82F6", bg: "#EFF6FF", dot: "#2563EB" },
  LIBERADO:   { label: "Liberado",   color: "#8B5CF6", bg: "#F5F3FF", dot: "#7C3AED" },
  APROVADO:   { label: "Aprovado",   color: "#10B981", bg: "#ECFDF5", dot: "#059669" },
  REJEITADO:  { label: "Rejeitado",  color: "#EF4444", bg: "#FEF2F2", dot: "#DC2626" },
  CANCELADO:  { label: "Cancelado",  color: "#6B7280", bg: "#F9FAFB", dot: "#4B5563" },
};


  function StatusBadge({ status }) {
  const m = STATUS_META[status] || {};
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      color: m.color, background: m.bg, border: `1px solid ${m.color}33`,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
      {m.label}
    </span>
  );
}

function fmt(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(d) {
  if (!d) return "—";
  const [y,m,day] = d.split("-");
  return `${day}/${m}/${y}`;
}

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: "12px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500,
          color: "#fff", minWidth: 260, maxWidth: 360,
          background: t.type === "error" ? "#EF4444" : "#10B981",
          boxShadow: "0 4px 20px rgba(0,0,0,.18)",
          animation: "slideIn .25s ease",
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 8000,
      background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 32, width: "min(560px,92vw)",
        boxShadow: "0 20px 60px rgba(0,0,0,.25)", position: "relative",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6B7280", lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Detalhe da Solicitação ───────────────────────────────────────────────────
function DetalheModal({ id, onClose, onStatusChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      setData(mockAPI.detalhar(id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  function handleTransicao(novoStatus) {
    setUpdating(true);
    try {
      const updated = mockAPI.atualizarStatus(id, novoStatus);
      setData(updated);
      onStatusChange(updated);
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <Modal title="Carregando..." onClose={onClose}><p>Aguarde...</p></Modal>;
  if (!data)   return <Modal title="Erro" onClose={onClose}><p>Não encontrado.</p></Modal>;

  const transicoes = TRANSITIONS[data.status] || [];
  const field = (label, value) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{value}</div>
    </div>
  );

  return (
    <Modal title={`Solicitação #${data.id}`} onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        {field("Solicitante", data.nomeSolicitante)}
        {field("CPF / CNPJ", data.cpfCnpjSolicitante)}
        {field("Categoria", data.nomeCategoria)}
        {field("Valor", fmt(data.valor))}
        {field("Data", fmtDate(data.dataSolicitacao))}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>Status</div>
          <StatusBadge status={data.status} />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Descrição</div>
        <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{data.descricao}</div>
      </div>
      {transicoes.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 10 }}>Alterar status para:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {transicoes.map(st => {
              const m = STATUS_META[st];
              return (
                <button key={st} disabled={updating} onClick={() => handleTransicao(st)} style={{
                  padding: "7px 16px", borderRadius: 8, border: `2px solid ${m.color}`,
                  background: m.bg, color: m.color, fontWeight: 700, fontSize: 13,
                  cursor: "pointer", transition: "opacity .15s",
                }}>
                  → {m.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── Formulário de Cadastro ───────────────────────────────────────────────────
function CadastroModal({ onClose, onCriada }) {
  const [form, setForm] = useState({ solicitanteId: "", categoriaId: "", descricao: "", valor: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const e = {};
    if (!form.solicitanteId)           e.solicitanteId = "Selecione um solicitante";
    if (!form.categoriaId)             e.categoriaId   = "Selecione uma categoria";
    if (!form.descricao.trim())        e.descricao     = "Descrição obrigatória";
    if (!form.valor || Number(form.valor) <= 0) e.valor = "Valor deve ser maior que zero";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      const nova = mockAPI.criar({
        solicitanteId: Number(form.solicitanteId),
        categoriaId:   Number(form.categoriaId),
        descricao:     form.descricao.trim(),
        valor:         parseFloat(form.valor),
      });
      onCriada(nova);
      onClose();
    } catch (e) {
      setErrors({ global: e.message });
    } finally {
      setSaving(false);
    }
  }

  const inp = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</label>
      <input type={type} value={form[key]} placeholder={placeholder}
        onChange={e => { setForm(p => ({...p, [key]: e.target.value})); setErrors(p => ({...p, [key]: ""})); }}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, boxSizing: "border-box",
          border: `1.5px solid ${errors[key] ? "#EF4444" : "#D1D5DB"}`, outline: "none", color: "#111827",
        }}
      />
      {errors[key] && <div style={{ fontSize: 12, color: "#EF4444", marginTop: 3 }}>{errors[key]}</div>}
    </div>
  );

  const sel = (label, key, options) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</label>
      <select value={form[key]} onChange={e => { setForm(p => ({...p, [key]: e.target.value})); setErrors(p => ({...p, [key]: ""})); }}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, boxSizing: "border-box",
          border: `1.5px solid ${errors[key] ? "#EF4444" : "#D1D5DB"}`, outline: "none", color: form[key] ? "#111827" : "#9CA3AF",
          background: "#fff",
        }}
      >
        <option value="">Selecione...</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
      {errors[key] && <div style={{ fontSize: 12, color: "#EF4444", marginTop: 3 }}>{errors[key]}</div>}
    </div>
  );

  return (
    <Modal title="Nova Solicitação" onClose={onClose}>
      {errors.global && <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "10px 14px", color: "#DC2626", fontSize: 13, marginBottom: 16 }}>{errors.global}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
        <div>{sel("Solicitante", "solicitanteId", mockDb.solicitantes.map(s => ({ id: s.id, label: s.nome })))}</div>
        <div>{sel("Categoria",   "categoriaId",   mockDb.categorias.map(c => ({ id: c.id, label: c.nome })))}</div>
      </div>
      {inp("Valor (R$)", "valor", "number", "0,00")}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>Descrição</label>
        <textarea value={form.descricao} rows={3}
          onChange={e => { setForm(p => ({...p, descricao: e.target.value})); setErrors(p => ({...p, descricao: ""})); }}
          style={{
            width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, boxSizing: "border-box", resize: "vertical",
            border: `1.5px solid ${errors.descricao ? "#EF4444" : "#D1D5DB"}`, outline: "none", color: "#111827", fontFamily: "inherit",
          }}
        />
        {errors.descricao && <div style={{ fontSize: 12, color: "#EF4444", marginTop: 3 }}>{errors.descricao}</div>}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancelar</button>
        <button onClick={handleSubmit} disabled={saving} style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: "#1D4ED8", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          {saving ? "Salvando..." : "Criar Solicitação"}
        </button>
      </div>
    </Modal>
  );
}

// ── Listagem principal ───────────────────────────────────────────────────────
function Listagem({ addToast }) {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalheId, setDetalheId] = useState(null);
  const [showCadastro, setShowCadastro] = useState(false);
  const [filtros, setFiltros] = useState({ status: "", categoriaId: "", dataInicio: "", dataFim: "" });

  const buscar = useCallback(() => {
    setLoading(true);
    try {
      const f = {};
      if (filtros.status)      f.status      = filtros.status;
      if (filtros.categoriaId) f.categoriaId = filtros.categoriaId;
      if (filtros.dataInicio)  f.dataInicio  = filtros.dataInicio;
      if (filtros.dataFim)     f.dataFim     = filtros.dataFim;
      setSolicitacoes(mockAPI.listarSolicitacoes(f));
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => { buscar(); }, [buscar]);

  function handleStatusChange(updated) {
    setSolicitacoes(prev => prev.map(s => s.id === updated.id ? updated : s));
    addToast("Status atualizado com sucesso!", "success");
    setDetalheId(null);
  }

  function handleCriada(nova) {
    setSolicitacoes(prev => [nova, ...prev]);
    addToast("Solicitação criada com sucesso!", "success");
  }

  const total = solicitacoes.reduce((acc, s) => acc + Number(s.valor), 0);

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-.02em" }}>
            Solicitações de Pagamento
          </h1>
          <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: 14 }}>
            Sistema de Gestão de Solicitações — SGS
          </p>
        </div>
        <button onClick={() => setShowCadastro(true)} style={{
          padding: "11px 22px", borderRadius: 10, border: "none",
          background: "#1D4ED8", color: "#fff", fontWeight: 700, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 2px 8px rgba(29,78,216,.3)",
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>＋</span> Nova Solicitação
        </button>
      </div>

      {/* Cards de resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 28 }}>
        {Object.entries(STATUS_META).map(([k, m]) => {
          const cnt = mockDb.solicitacoes.filter(s => s.status === k).length;
          return (
            <div key={k} style={{
              background: m.bg, border: `1.5px solid ${m.color}33`, borderRadius: 12,
              padding: "14px 18px", cursor: "pointer",
              outline: filtros.status === k ? `2px solid ${m.color}` : "none",
            }} onClick={() => setFiltros(p => ({ ...p, status: p.status === k ? "" : k }))}>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{cnt}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: m.color, marginTop: 2 }}>{m.label}</div>
            </div>
          );
        })}
        <div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 12, padding: "14px 18px" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#166534" }}>{fmt(total)}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#166534", marginTop: 2 }}>Total Filtrado</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12,
        padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: 4 }}>Status</div>
          <select value={filtros.status} onChange={e => setFiltros(p => ({...p, status: e.target.value}))}
            style={{ padding: "7px 12px", borderRadius: 7, border: "1.5px solid #D1D5DB", fontSize: 13, background: "#fff", color: "#111827" }}>
            <option value="">Todos</option>
            {Object.entries(STATUS_META).map(([k,m]) => <option key={k} value={k}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: 4 }}>Categoria</div>
          <select value={filtros.categoriaId} onChange={e => setFiltros(p => ({...p, categoriaId: e.target.value}))}
            style={{ padding: "7px 12px", borderRadius: 7, border: "1.5px solid #D1D5DB", fontSize: 13, background: "#fff", color: "#111827" }}>
            <option value="">Todas</option>
            {mockDb.categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: 4 }}>De</div>
          <input type="date" value={filtros.dataInicio} onChange={e => setFiltros(p => ({...p, dataInicio: e.target.value}))}
            style={{ padding: "7px 12px", borderRadius: 7, border: "1.5px solid #D1D5DB", fontSize: 13, background: "#fff" }} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", marginBottom: 4 }}>Até</div>
          <input type="date" value={filtros.dataFim} onChange={e => setFiltros(p => ({...p, dataFim: e.target.value}))}
            style={{ padding: "7px 12px", borderRadius: 7, border: "1.5px solid #D1D5DB", fontSize: 13, background: "#fff" }} />
        </div>
        <button onClick={() => setFiltros({ status: "", categoriaId: "", dataInicio: "", dataFim: "" })}
          style={{ padding: "7px 16px", borderRadius: 7, border: "1.5px solid #D1D5DB", background: "#fff", color: "#6B7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          Limpar
        </button>
      </div>

      {/* Tabela */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1.5px solid #E5E7EB" }}>
                {["#","Solicitante","CPF / CNPJ","Categoria","Valor","Data","Status","Ações"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: ".06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>Carregando...</td></tr>
              ) : solicitacoes.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: "center", color: "#9CA3AF" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  Nenhuma solicitação encontrada
                </td></tr>
              ) : solicitacoes.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #F3F4F6", transition: "background .1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px", color: "#9CA3AF", fontWeight: 600, fontSize: 12 }}>#{s.id}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "#111827" }}>{s.nomeSolicitante}</td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontFamily: "monospace", fontSize: 13 }}>{s.cpfCnpjSolicitante}</td>
                  <td style={{ padding: "12px 16px", color: "#374151" }}>{s.nomeCategoria}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>{fmt(s.valor)}</td>
                  <td style={{ padding: "12px 16px", color: "#6B7280", whiteSpace: "nowrap" }}>{fmtDate(s.dataSolicitacao)}</td>
                  <td style={{ padding: "12px 16px" }}><StatusBadge status={s.status} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => setDetalheId(s.id)} style={{
                      padding: "5px 12px", borderRadius: 7, border: "1.5px solid #E5E7EB",
                      background: "#fff", color: "#374151", fontWeight: 600, fontSize: 12,
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}>
                      Ver / Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {solicitacoes.length > 0 && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid #F3F4F6", fontSize: 13, color: "#6B7280", display: "flex", justifyContent: "space-between" }}>
            <span>{solicitacoes.length} registro{solicitacoes.length !== 1 ? "s" : ""}</span>
            <span>Total: <strong style={{ color: "#111827" }}>{fmt(total)}</strong></span>
          </div>
        )}
      </div>

      {/* Modals */}
      {detalheId && <DetalheModal id={detalheId} onClose={() => setDetalheId(null)} onStatusChange={handleStatusChange} />}
      {showCadastro && <CadastroModal onClose={() => setShowCadastro(false)} onCriada={handleCriada} />}
    </div>
  );
}

// ── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [toasts, setToasts] = useState([]);

  function addToast(msg, type = "success") {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F3F4F6; color: #111827; }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        button:hover { opacity: .88; }
        input:focus, select:focus, textarea:focus { border-color: #3B82F6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
      `}</style>

      {/* Nav */}
      <nav style={{
        background: "#1E3A5F", color: "#fff",
        padding: "0 32px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: "#3B82F6",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800,
          }}>S</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-.01em" }}>SGS</div>
            <div style={{ fontSize: 11, color: "#93C5FD", marginTop: -2 }}>Sistema de Gestão de Solicitações</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#93C5FD" }}>Sergipe Tec — Desafio Técnico 2026</div>
      </nav>

      <Listagem addToast={addToast} />
      <Toast toasts={toasts} />
    </>
  );
}