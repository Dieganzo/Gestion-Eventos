import { beforeAll, describe, expect, it } from 'vitest';
import {
  api,
  iniciarSesionAdmin
} from '../helpers/autenticacionTestHelper.js';

describe('Integración - Estadísticas de asistencia', () => {
  let token;
  let eventoId;

  beforeAll(async () => {
    const respuestaLogin = await iniciarSesionAdmin();

    if (respuestaLogin.statusCode !== 200) {
      throw new Error('No se pudo iniciar sesión para preparar la prueba');
    }

    token = respuestaLogin.body.token;

    const respuestaEventos = await api
      .get('/api/eventos')
      .set('Authorization', `Bearer ${token}`);

    if (respuestaEventos.statusCode !== 200 || respuestaEventos.body.length === 0) {
      throw new Error('Debe existir al menos un evento para probar estadísticas');
    }

    eventoId = respuestaEventos.body[0].id;
  });

  it('debe rechazar estadisticas sin token', async () => {
    const respuesta = await api.get(
      `/api/eventos/${eventoId}/asistentes/estadisticas`
    );

    expect(respuesta.statusCode).toBe(401);
    expect(respuesta.body).toHaveProperty('error');
  });

  it('debe devolver las estadisticas de un evento autenticado', async () => {
    const respuesta = await api
      .get(`/api/eventos/${eventoId}/asistentes/estadisticas`)
      .set('Authorization', `Bearer ${token}`);

    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body).toHaveProperty('total');
    expect(respuesta.body).toHaveProperty('asistieron');
    expect(respuesta.body).toHaveProperty('no_asistieron');
    expect(respuesta.body).toHaveProperty('porcentaje_asistencia');

    expect(respuesta.body.total).toBeGreaterThanOrEqual(0);
    expect(respuesta.body.porcentaje_asistencia).toBeGreaterThanOrEqual(0);
    expect(respuesta.body.porcentaje_asistencia).toBeLessThanOrEqual(100);
  });
});
