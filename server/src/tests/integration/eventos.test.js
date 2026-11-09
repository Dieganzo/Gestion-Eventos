import 'dotenv/config';
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

const api = request('http://localhost:3000');

const correoAdmin = process.env.TEST_ADMIN_CORREO;
const contrasenaAdmin = process.env.TEST_ADMIN_CONTRASENA;

describe('Integración - Eventos', () => {
  let token;

  beforeAll(async () => {
    const respuestaLogin = await api
      .post('/api/auth/login')
      .send({
        correo: correoAdmin,
        contrasena: contrasenaAdmin
      });

    if (respuestaLogin.statusCode !== 200) {
      throw new Error('No se pudo obtener el token de administrador para la prueba');
    }

    token = respuestaLogin.body.token;
  });

  it('GET /api/eventos debe rechazar la solicitud sin token', async () => {
    const respuesta = await api.get('/api/eventos');

    expect(respuesta.statusCode).toBe(401);
    expect(respuesta.body).toHaveProperty('error');
  });

  it('GET /api/eventos debe devolver una lista para un administrador autenticado', async () => {
    const respuesta = await api
      .get('/api/eventos')
      .set('Authorization', `Bearer ${token}`);

    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
  });
});