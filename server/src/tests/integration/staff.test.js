import { beforeAll, describe, expect, it } from 'vitest';
import {
  api,
  iniciarSesionAdmin
} from '../helpers/autenticacionTestHelper.js';

describe('Integracion - Staff', () => {
  let token;

  beforeAll(async () => {
    const respuestaLogin = await iniciarSesionAdmin();

    if (respuestaLogin.statusCode !== 200) {
      throw new Error('No se pudo obtener el token de administrador para la prueba');
    }

    token = respuestaLogin.body.token;
  });

  it('GET /api/staff debe rechazar la solicitud sin token', async () => {
    const respuesta = await api.get('/api/staff');

    expect(respuesta.statusCode).toBe(401);
    expect(respuesta.body).toHaveProperty('error');
  });

  it('GET /api/staff debe devolver una lista para un administrador autenticado', async () => {
    const respuesta = await api
      .get('/api/staff')
      .set('Authorization', `Bearer ${token}`);

    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
  });
});
