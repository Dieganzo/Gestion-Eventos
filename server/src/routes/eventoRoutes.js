import express from 'express';

import {
  listarEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento
} from '../controllers/eventoController.js';
import { autorizarRoles, verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken, autorizarRoles('admin'));

// crud eventos
router.get('/', listarEventos);
router.post('/', crearEvento);
router.get('/:id', obtenerEventoPorId);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);

export default router;
