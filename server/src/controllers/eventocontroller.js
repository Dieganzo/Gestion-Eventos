import pool from '../database/connection.js';

// GET /api/eventos
// Obtiene todos los eventos
export const listarEventos = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM evento ORDER BY creado_en DESC'
    );

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener eventos:', error);

    res.status(500).json({
      error: 'Error al obtener los eventos'
    });
  }
};


// GET /api/eventos/:id
// Obtiene un solo evento por su ID
export const obtenerEventoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      'SELECT * FROM evento WHERE id = $1',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Evento no encontrado'
      });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener evento:', error);

    res.status(500).json({
      error: 'Error al obtener el evento'
    });
  }
};


// POST /api/eventos
// Crea un nuevo evento
export const crearEvento = async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({
      error: 'El nombre del evento es obligatorio'
    });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO evento (nombre, descripcion)
       VALUES ($1, $2)
       RETURNING *`,
      [nombre.trim(), descripcion?.trim() || null]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear evento:', error);

    res.status(500).json({
      error: 'Error al crear el evento'
    });
  }
};


// PUT /api/eventos/:id
// Actualiza el nombre y/o descripcion de un evento
export const actualizarEvento = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({
      error: 'El nombre del evento es obligatorio'
    });
  }

  try {
    const resultado = await pool.query(
      `UPDATE evento
       SET nombre = $1,
           descripcion = $2,
           actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [nombre.trim(), descripcion?.trim() || null, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Evento no encontrado'
      });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al actualizar evento:', error);

    res.status(500).json({
      error: 'Error al actualizar el evento'
    });
  }
};


// DELETE /api/eventos/:id
// Elimina un evento (sus asistentes se eliminan automaticamente)
// por ON DELETE CASCADE de PostgreSQL
export const eliminarEvento = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      'DELETE FROM evento WHERE id = $1 RETURNING *',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Evento no encontrado'
      });
    }

    res.status(200).json({
      mensaje: 'Evento eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);

    res.status(500).json({
      error: 'Error al eliminar el evento'
    });
  }
};