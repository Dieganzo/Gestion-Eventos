export const calcularPorcentajeAsistencia = (total, asistieron) => {
  if (total <= 0) {
    return 0;
  }

  return Math.round((asistieron / total) * 100);
};

export const esEstadoAsistenciaValido = (asistio) => {
  return typeof asistio === 'boolean';
};