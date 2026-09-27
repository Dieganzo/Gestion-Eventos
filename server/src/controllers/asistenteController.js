import pool from '../database/connection.js';

// Verifica que exista un evento
const existeEvento = async (eventoId) => {
  const resultado = await pool.query(
    'SELECT id FROM evento WHERE id = $1',
    [eventoId]
  );

  return resultado.rows.length > 0;
};

// Verifica que exista un staff
const existeStaff = async (staffId) => {
  const resultado = await pool.query(
    'SELECT id FROM staff WHERE id = $1',
    [staffId]
  );

  return resultado.rows.length > 0;
};


// GET /api/eventos/:eventoId/asistentes
// Obtiene los asistentes de un evento
export const listarAsistentes = async (req, res) => {
  const { eventoId } = req.params;
  const { busqueda } = req.query;

  try {
    let consulta = `
      SELECT
        a.*,
        s.nombre AS staff_nombre
      FROM asistentes a
      INNER JOIN staff s ON a.staff_id = s.id
      WHERE a.evento_id = $1
    `;

    const parametros = [eventoId];

    // Filtro opcional por nombre o RUT.
    if (busqueda) {
      consulta += `
        AND (
          a.nombre ILIKE $2
          OR a.rut ILIKE $2
        )
      `;

      parametros.push(`%${busqueda}%`);
    }

    consulta += ' ORDER BY a.nombre ASC';

    const resultado = await pool.query(consulta, parametros);

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener asistentes:', error);

    res.status(500).json({
      error: 'Error al obtener los asistentes'
    });
  }
};


// POST /api/eventos/:eventoId/asistentes
// Crea un asistente dentro de un evento
export const crearAsistente = async (req, res) => {
  const { eventoId } = req.params;
  const { nombre, rut, staff_id } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({
      error: 'El nombre del asistente es obligatorio'
    });
  }

  if (!staff_id) {
    return res.status(400).json({
      error: 'Debe seleccionar un staff responsable'
    });
  }

  try {
    if (!(await existeEvento(eventoId))) {
      return res.status(404).json({
        error: 'El evento no existe'
      });
    }

    if (!(await existeStaff(staff_id))) {
      return res.status(404).json({
        error: 'El staff seleccionado no existe'
      });
    }

    const resultado = await pool.query(
      `INSERT INTO asistentes (evento_id, staff_id, nombre, rut)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        eventoId,
        staff_id,
        nombre.trim(),
        rut?.trim() || null
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear asistente:', error);

    res.status(500).json({
      error: 'Error al crear el asistente'
    });
  }
};


// PUT /api/eventos/:eventoId/asistentes/:asistenteId
// Actualiza datos del asistente
export const actualizarAsistente = async (req, res) => {
  const { eventoId, asistenteId } = req.params;
  const { nombre, rut, staff_id } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({
      error: 'El nombre del asistente es obligatorio'
    });
  }

  if (!staff_id) {
    return res.status(400).json({
      error: 'Debe seleccionar un staff responsable'
    });
  }

  try {
    if (!(await existeStaff(staff_id))) {
      return res.status(404).json({
        error: 'El staff seleccionado no existe'
      });
    }

    const resultado = await pool.query(
      `UPDATE asistentes
       SET nombre = $1,
           rut = $2,
           staff_id = $3,
           actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $4
         AND evento_id = $5
       RETURNING *`,
      [
        nombre.trim(),
        rut?.trim() || null,
        staff_id,
        asistenteId,
        eventoId
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Asistente no encontrado en este evento'
      });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al actualizar asistente:', error);

    res.status(500).json({
      error: 'Error al actualizar el asistente'
    });
  }
};


// PATCH /api/eventos/:eventoId/asistentes/:asistenteId/asistencia
// Marca o desmarca asistencia
export const actualizarAsistencia = async (req, res) => {
  const { eventoId, asistenteId } = req.params;
  const { asistio } = req.body;

  if (typeof asistio !== 'boolean') {
    return res.status(400).json({
      error: 'El campo asistio debe ser true o false'
    });
  }

  try {
    const resultado = await pool.query(
      `UPDATE asistentes
       SET asistio = $1,
           asistio_en = $2,
           actualizado_en = CURRENT_TIMESTAMP
       WHERE id = $3
         AND evento_id = $4
       RETURNING *`,
      [
        asistio,
        asistio ? new Date() : null,
        asistenteId,
        eventoId
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Asistente no encontrado en este evento'
      });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);

    res.status(500).json({
      error: 'Error al actualizar la asistencia'
    });
  }
};


// DELETE /api/eventos/:eventoId/asistentes/:asistenteId
// Elimina un asistente del evento
export const eliminarAsistente = async (req, res) => {
  const { eventoId, asistenteId } = req.params;

  try {
    const resultado = await pool.query(
      `DELETE FROM asistentes
       WHERE id = $1
         AND evento_id = $2
       RETURNING *`,
      [asistenteId, eventoId]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Asistente no encontrado en este evento'
      });
    }

    res.status(200).json({
      mensaje: 'Asistente eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar asistente:', error);

    res.status(500).json({
      error: 'Error al eliminar el asistente'
    });
  }
};


// GET /api/eventos/:eventoId/asistentes/estadisticas
// Funcionalidad extra: devuelve resumen de asistencia.
export const obtenerEstadisticasAsistencia = async (req, res) => {
  const { eventoId } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE asistio = true)::int AS asistieron,
        COUNT(*) FILTER (WHERE asistio = false)::int AS no_asistieron
       FROM asistentes
       WHERE evento_id = $1`,
      [eventoId]
    );

    const estadisticas = resultado.rows[0];

    const porcentaje =
      estadisticas.total > 0
        ? Math.round((estadisticas.asistieron / estadisticas.total) * 100)
        : 0;

    res.status(200).json({
      ...estadisticas,
      porcentaje_asistencia: porcentaje
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);

    res.status(500).json({
      error: 'Error al obtener estadísticas de asistencia'
    });
  }
};
