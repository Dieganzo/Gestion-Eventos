import { describe, expect, it } from 'vitest';
import {
  calcularPorcentajeAsistencia,
  esEstadoAsistenciaValido
} from '../../helpers/asistenciaHelper.js';

describe('Asistencia Helper - Pruebas Unitarias', () => {
  it('debe calcular correctamente el porcentaje de asistencia', () => {
    const porcentaje = calcularPorcentajeAsistencia(10, 8);

    expect(porcentaje).toBe(80);
  });

  it('debe retornar 0 si no existen asistentes', () => {
    const porcentaje = calcularPorcentajeAsistencia(0, 0);

    expect(porcentaje).toBe(0);
  });

  it('debe aceptar true y false como estados válidos', () => {
    expect(esEstadoAsistenciaValido(true)).toBe(true);
    expect(esEstadoAsistenciaValido(false)).toBe(true);
  });

  it('debe rechazar valores que no sean booleanos', () => {
    expect(esEstadoAsistenciaValido('true')).toBe(false);
    expect(esEstadoAsistenciaValido(1)).toBe(false);
    expect(esEstadoAsistenciaValido(null)).toBe(false);
  });
});