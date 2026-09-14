import express from 'express';

import {
  listarAsistentes,
  crearAsistente,
  actualizarAsistente,
  actualizarAsistencia,
  eliminarAsistente,
  obtenerEstadisticasAsistencia
} from '../controllers/asistentecontroller.js';

// Premite acceder a eventoId definido en index.js
const router = express.Router({ mergeParams: true });

// Estadisticas evento
router.get('/estadisticas', obtenerEstadisticasAsistencia);

// CRUD asistentes
router.get('/', listarAsistentes);
router.post('/', crearAsistente);
router.put('/:asistenteId', actualizarAsistente);
router.patch('/:asistenteId/asistencia', actualizarAsistencia);
router.delete('/:asistenteId', eliminarAsistente);

export default router;