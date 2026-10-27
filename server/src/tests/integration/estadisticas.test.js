import 'dotenv/config';
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

const api = request('http://localhost:3000');

const correoAdmin = process.env.TEST_ADMIN_CORREO;
const contrasenaAdmin = process.env.TEST_ADMIN_CONTRASENA;

describe('Integración - Estadísticas de asistencia', () => {
  let token;
  let eventoId;

  beforeAll(async () => {
    const respuestaLogin = await api
      .post('/api/auth/login')
      .send({
        correo: correoAdmin,
        contrasena: contrasenaAdmin
      });

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

  it('debe rechazar estadísticas sin token', async () => {
    const respuesta = await api.get(
      `/api/eventos/${eventoId}/asistentes/estadisticas`
    );

    expect(respuesta.statusCode).toBe(401);
    expect(respuesta.body).toHaveProperty('error');
  });

  it('debe devolver las estadísticas de un evento autenticado', async () => {
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