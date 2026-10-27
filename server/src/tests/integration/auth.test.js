import 'dotenv/config';
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

const api = request('http://localhost:3000');

const correoAdmin = process.env.TEST_ADMIN_CORREO;
const contrasenaAdmin = process.env.TEST_ADMIN_CONTRASENA;

describe('Integración - Autenticación', () => {
  let token;

  it('POST /api/auth/login debe responder 400 si falta la contraseña', async () => {
    const respuesta = await api
      .post('/api/auth/login')
      .send({ correo: correoAdmin });

    expect(respuesta.statusCode).toBe(400);
    expect(respuesta.body).toHaveProperty('error');
  });

  it('POST /api/auth/login debe iniciar sesión con credenciales válidas', async () => {
    const respuesta = await api
      .post('/api/auth/login')
      .send({
        correo: correoAdmin,
        contrasena: contrasenaAdmin
      });

    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body).toHaveProperty('token');
    expect(respuesta.body).toHaveProperty('usuario');
    expect(respuesta.body.usuario.rol).toBe('admin');

    token = respuesta.body.token;
  });

  it('GET /api/auth/perfil debe devolver el usuario con un token válido', async () => {
    const respuesta = await api
      .get('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body).toHaveProperty('usuario');
    expect(respuesta.body.usuario.correo).toBe(correoAdmin);
  });
});