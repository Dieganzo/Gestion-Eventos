import express from 'express';

import {
  listarEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento
} from '../controllers/eventocontroller.js';

const router = express.Router();

// crud eventos
router.get('/', listarEventos);
router.post('/', crearEvento);
router.get('/:id', obtenerEventoPorId);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);

export default router;
