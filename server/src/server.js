import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import authRoutes from './routes/authRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import asistenteRoutes from './routes/asistenteRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Ubicación de client/dist para producción
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
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

// Frontend compilado: se usa en producción
app.use(express.static(clientDistPath));

app.get('*', (request, response, next) => {
  if (request.path.startsWith('/api/')) {
    return next();
  }

  response.sendFile(path.join(clientDistPath, 'index.html'), (error) => {
    if (error) {
      next(error);
    }
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