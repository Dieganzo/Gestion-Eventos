import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import asistenteRoutes from './routes/asistenteRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/eventos/:eventoId/asistentes', asistenteRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/staff', staffRoutes);

// Health check
app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente'
  });
});

// Ruta inexistente
app.use((_request, response) => {
  response.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Errores no controlados
app.use((error, _request, response, _next) => {
  console.error('Error no controlado:', error);

  response.status(500).json({
    error: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});