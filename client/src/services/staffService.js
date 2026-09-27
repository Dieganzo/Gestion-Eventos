import { apiFetch } from './api.js';

export const staffService = {
  listar: () => apiFetch('/staff')
};