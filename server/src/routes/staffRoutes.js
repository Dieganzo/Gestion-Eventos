import express from 'express';

import {
  listarStaff,
  crearStaff,
  actualizarStaff,
  eliminarStaff
} from '../controllers/staffController.js';
import { autorizarRoles, verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken, autorizarRoles('admin'));

//crud staff
router.get('/', listarStaff);
router.post('/', crearStaff);
router.put('/:id', actualizarStaff);
router.delete('/:id', eliminarStaff);

export default router;
