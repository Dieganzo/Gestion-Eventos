import express from 'express';

import {
  listarStaff,
  crearStaff,
  actualizarStaff,
  eliminarStaff
} from '../controllers/staffcontroller.js';

const router = express.Router();

//crud staff
router.get('/', listarStaff);
router.post('/', crearStaff);
router.put('/:id', actualizarStaff);
router.delete('/:id', eliminarStaff);

export default router;
