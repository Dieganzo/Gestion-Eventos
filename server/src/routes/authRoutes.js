import express from 'express';
import {
  iniciarSesion,
  obtenerPerfil,
  registrarUsuario
} from '../controllers/authController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);
router.get('/perfil', verificarToken, obtenerPerfil);

export default router;
