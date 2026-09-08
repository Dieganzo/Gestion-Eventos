import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import staffRoutes from './routes/staffRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Permite que el frontend se conecte al backend.
app.use(cors());

// Permite recibir datos JSON desde formularios o React.
app.use(express.json());

// Permite recibir datos enviados como formulario.
app.use(express.urlencoded({ extended: true }));

// Rutas de los CRUD.
app.use('/api/staff', staffRoutes);
app.use('/api/eventos', eventoRoutes);

// Ruta para comprobar si el backend está funcionando.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta no encontrada.
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Manejo general de errores.
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Inicia el servidor.
app.listen(PORT, () => {
  console.log(`Servidor iniciado en: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});