import 'dotenv/config';
import request from 'supertest';

const URL_API = process.env.TEST_API_URL || 'http://localhost:3000';

export const api = request(URL_API);
export const correoAdmin = process.env.TEST_ADMIN_CORREO;

export const iniciarSesionAdmin = () => {
  return api
    .post('/api/auth/login')
    .send({
      correo: correoAdmin,
      contrasena: process.env.TEST_ADMIN_CONTRASENA
    });
};
