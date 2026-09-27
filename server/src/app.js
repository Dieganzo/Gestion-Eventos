import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/authRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import asistenteRoutes from './routes/asistenteRoutes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Desde server/src/app.js subimos hasta la raíz y entramos a client/dist
const clientDistPath = path.resolve(__dirname, '../../client/dist');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/eventos/:eventoId/asistentes', asistenteRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/staff', staffRoutes);

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    message: 'Servidor funcionando correctamente'
  });
});

app.use(express.static(clientDistPath));

app.get('*', (request, response, next) => {

  if (request.path.startsWith('/api/')) {
    return next();
  }

  response.sendFile(path.join(clientDistPath, 'index.html'), (error) => {
    if (error) {
      next();
    }
  });
});


app.use((_request, response) => {
  response.status(404).json({ error: 'Ruta no encontrada' });
});


app.use((error, _request, response, _next) => {
  console.error('Error no controlado:', error);
  response.status(500).json({ error: 'Error interno del servidor' });
});

export default app;

