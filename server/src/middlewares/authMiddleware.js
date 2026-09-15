import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const encabezadoAutorizacion = req.headers.authorization;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ error: 'Falta configurar JWT_SECRET en el archivo .env' });
  }

  if (!encabezadoAutorizacion?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  const token = encabezadoAutorizacion.substring(7);

  try {
    req.usuario = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o vencido' });
  }
};

export const autorizarRoles = (...rolesPermitidos) => (req, res, next) => {
  if (!rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
  }

  return next();
};
