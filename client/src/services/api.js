const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiFetch = async (ruta, opciones = {}) => {
  const sesionGuardada = localStorage.getItem('sesion');
  const sesion = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      Authorization: sesion ? `Bearer ${sesion.token}` : '',
      ...opciones.headers
    }
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error || 'Ocurrió un error en la solicitud');
  }

  return datos;
};