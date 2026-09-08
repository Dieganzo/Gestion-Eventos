import pool from '../database/connection.js';

// GET /api/staff
// Obtiene staff ordenado por nombre
export const listarStaff = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM staff ORDER BY nombre ASC'
    );

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener staff:', error);

    res.status(500).json({
      error: 'Error al obtener el staff'
    });
  }
};


// POST /api/staff
// Crea nuevo staff
export const crearStaff = async (req, res) => {
  const { nombre } = req.body;

  // Validacion: nombre obligatorio
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({
      error: 'El nombre del staff es obligatorio'
    });
  }

  const nombreLimpio = nombre.trim();

  try {
    // Evita nombres repetido ignorando mayusculas y minusculas
    const staffExistente = await pool.query(
      'SELECT id FROM staff WHERE LOWER(nombre) = LOWER($1)',
      [nombreLimpio]
    );

    if (staffExistente.rows.length > 0) {
      return res.status(409).json({
        error: 'Ya existe un staff con ese nombre'
      });
    }

    // Inserta el staff y devuelve el registro creado
    const resultado = await pool.query(
      `INSERT INTO staff (nombre)
       VALUES ($1)
       RETURNING *`,
      [nombreLimpio]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear staff:', error);

    res.status(500).json({
      error: 'Error al crear el staff'
    });
  }
};


// PUT /api/staff/:id
// Edita el nombre de un staff existente
export const actualizarStaff = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({
      error: 'El nombre del staff es obligatorio'
    });
  }

  const nombreLimpio = nombre.trim();

  try {
    // Comprueba que no exista otro staff con el mismo nombre
    const staffExistente = await pool.query(
      `SELECT id
       FROM staff
       WHERE LOWER(nombre) = LOWER($1)
       AND id <> $2`,
      [nombreLimpio, id]
    );

    if (staffExistente.rows.length > 0) {
      return res.status(409).json({
        error: 'Ya existe otro staff con ese nombre'
      });
    }

    // Actualiza el nombre y la fecha de modificacion
    const resultado = await pool.query(
      `UPDATE staff
       SET nombre = $1,
           actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [nombreLimpio, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Staff no encontrado'
      });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al actualizar staff:', error);

    res.status(500).json({
      error: 'Error al actualizar el staff'
    });
  }
};


// DELETE /api/staff/:id
// Elimina un staff solo si no tiene asistentes asignados
export const eliminarStaff = async (req, res) => {
  const { id } = req.params;

  try {
    // Cuenta asistentes que dependen de este staff
    const usoStaff = await pool.query(
      `SELECT COUNT(*)::int AS cantidad
       FROM asistentes
       WHERE staff_id = $1`,
      [id]
    );

    const cantidad = usoStaff.rows[0].cantidad;

    // Evita eliminar un staff que aun tiene asistentes
    if (cantidad > 0) {
      return res.status(409).json({
        error: `No se puede eliminar: este staff tiene ${cantidad} asistente(s) asociado(s)`,
        cantidad
      });
    }

    const resultado = await pool.query(
      'DELETE FROM staff WHERE id = $1 RETURNING *',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Staff no encontrado'
      });
    }

    res.status(200).json({
      mensaje: 'Staff eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar staff:', error);

    res.status(500).json({
      error: 'Error al eliminar el staff'
    });
  }
};