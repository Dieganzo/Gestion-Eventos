import { apiFetch } from './api.js';

export const asistenteService = {
  listarPorEvento: (eventoId) =>
    apiFetch(`/eventos/${eventoId}/asistentes`),

  crear: (eventoId, nuevoAsistente) =>
    apiFetch(`/eventos/${eventoId}/asistentes`, {
      method: 'POST',
      body: JSON.stringify(nuevoAsistente)
    })
};