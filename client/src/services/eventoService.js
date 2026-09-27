import { apiFetch } from './api.js';

export const eventoService = {
  listar: () => apiFetch('/eventos'),
  obtenerPorId: (id) => apiFetch(`/eventos/${id}`),

  crear: (nuevoEvento) =>
    apiFetch('/eventos', {
      method: 'POST',
      body: JSON.stringify(nuevoEvento)
    }),

  actualizar: (id, datosActualizados) =>
    apiFetch(`/eventos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datosActualizados)
    }),

  eliminar: (id) =>
    apiFetch(`/eventos/${id}`, {
      method: 'DELETE'
    })
};