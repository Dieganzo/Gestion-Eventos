import { describe, expect, it, vi } from 'vitest';

vi.mock('../../database/connection.js', () => ({
  default: {
    query: vi.fn(),
    on: vi.fn()
  }
}));

import pool from '../../database/connection.js';
import { crearStaff } from '../../controllers/staffController.js';

const crearRespuesta = () => {
  const respuesta = {};

  respuesta.status = vi.fn().mockReturnValue(respuesta);
  respuesta.json = vi.fn().mockReturnValue(respuesta);

  return respuesta;
};

describe('Crear staff - Pruebas Unitarias', () => {
  it('debe rechazar un nombre de staff vacio sin consultar la base de datos', async () => {
    const solicitud = {
      body: {
        nombre: '   '
      }
    };
    const respuesta = crearRespuesta();

    await crearStaff(solicitud, respuesta);

    expect(respuesta.status).toHaveBeenCalledWith(400);
    expect(respuesta.json).toHaveBeenCalledWith({
      error: 'El nombre del staff es obligatorio'
    });
    expect(pool.query).not.toHaveBeenCalled();
  });
});
