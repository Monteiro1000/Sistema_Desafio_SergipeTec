import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// ── Solicitações ─────────────────────────────────────────────────────────────
export const solicitacoesAPI = {
  listar: (params) => api.get('/solicitacoes', { params }),
  detalhar: (id) => api.get(`/solicitacoes/${id}`),
  criar: (data) => api.post('/solicitacoes', data),
  atualizarStatus: (id, novoStatus) =>
    api.patch(`/solicitacoes/${id}/status`, { novoStatus }),
};

// ── Solicitantes ─────────────────────────────────────────────────────────────
export const solicitantesAPI = {
  listar: () => api.get('/solicitantes'),
};

// ── Categorias ───────────────────────────────────────────────────────────────
export const categoriasAPI = {
  listar: () => api.get('/categorias'),
};

export default api;
