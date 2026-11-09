import { beforeAll, describe, expect, it } from 'vitest';
import {
  api,
  iniciarSesionAdmin
} from '../helpers/autenticacionTestHelper.js';

describe('Integracion - Asistentes', () => {
  let token;
  let eventoId;

  beforeAll(async () => {
    const respuestaLogin = await iniciarSesionAdmin();

    if (respuestaLogin.statusCode !== 200) {
      throw new Error('No se pudo iniciar sesion para preparar la prueba');
    }

    token = respuestaLogin.body.token;

    const respuestaEventos = await api
      .get('/api/eventos')
      .set('Authorization', `Bearer ${token}`);

    if (respuestaEventos.statusCode !== 200 || respuestaEventos.body.length === 0) {
      throw new Error('Debe existir al menos un evento para probar asistentes');
    }

    eventoId = respuestaEventos.body[0].id;
  });

  it('GET /api/eventos/:eventoId/asistentes debe rechazar la solicitud sin token', async () => {
    const respuesta = await api.get(`/api/eventos/${eventoId}/asistentes`);

    expect(respuesta.statusCode).toBe(401);
    expect(respuesta.body).toHaveProperty('error');
  });

  it('GET /api/eventos/:eventoId/asistentes debe devolver una lista autenticada', async () => {
    const respuesta = await api
      .get(`/api/eventos/${eventoId}/asistentes`)
      .set('Authorization', `Bearer ${token}`);

    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
  });
});
