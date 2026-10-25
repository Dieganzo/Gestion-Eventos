import bcrypt from 'bcryptjs';

export const encriptarContrasena = async (contrasena) => {
  return bcrypt.hash(contrasena, 12);
};

export const compararContrasena = async (contrasena, hash) => {
  return bcrypt.compare(contrasena, hash);
};