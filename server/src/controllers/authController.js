import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/connection.js';

// POST /api/auth/registro
// Crea usuarios con rol staff. El rol admin se asigna de forma controlada.
export const registrarUsuario = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  if (typeof correo !== 'string' || !correo.trim()) {
    return res.status(400).json({ error: 'El correo es obligatorio' });
  }

  if (typeof contrasena !== 'string' || contrasena.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  const nombreLimpio = nombre.trim();
  const correoLimpio = correo.trim().toLowerCase();

  try {
    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE LOWER(correo) = LOWER($1)',
      [correoLimpio]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
    }

    const contrasenaHash = await bcrypt.hash(contrasena, 12);
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena_hash, rol)
       VALUES ($1, $2, $3, 'staff')
       RETURNING id, nombre, correo, rol, creado_en`,
      [nombreLimpio, correoLimpio, contrasenaHash]
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// POST /api/auth/login
export const iniciarSesion = async (req, res) => {
  const { correo, contrasena } = req.body;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ error: 'Falta configurar JWT_SECRET en el archivo .env' });
  }

  if (typeof correo !== 'string' || typeof contrasena !== 'string') {
    return res.status(400).json({ error: 'El correo y la contraseña son obligatorios' });
  }

  try {
    const resultado = await pool.query(
      `SELECT id, nombre, correo, contrasena_hash, rol
       FROM usuarios
       WHERE LOWER(correo) = LOWER($1)`,
      [correo.trim()]
    );
    const usuario = resultado.rows[0];

    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena_hash))) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      jwtSecret,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// GET /api/auth/perfil
export const obtenerPerfil = async (req, res) => {
  return res.status(200).json({ usuario: req.usuario });
};
