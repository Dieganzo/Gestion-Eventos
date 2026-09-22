import React, { useState } from 'react';

function CrearAsistenteModal({ staff, alCerrar, alCrear, guardando }) {
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [staffId, setStaffId] = useState('');

  const enviarFormulario = async (e) => {
    e.preventDefault();

    await alCrear({
      nombre,
      rut,
      staff_id: Number(staffId)
    });
  };

  return (
    <div className="modal-fondo" onClick={alCerrar}>
      <form
        className="modal-contenido"
        onSubmit={enviarFormulario}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-encabezado">
          <h2>Agregar asistente</h2>
        </div>

        <div className="modal-grupo">
          <label htmlFor="nombreAsistente">Nombre completo</label>
          <input
            id="nombreAsistente"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Pedro González"
            autoFocus
            required
          />
        </div>

        <div className="modal-grupo">
          <label htmlFor="rutAsistente">RUT</label>
          <input
            id="rutAsistente"
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="Ej: 12.345.678-9"
          />
        </div>

        <div className="modal-grupo">
          <label htmlFor="staffAsistente">Staff responsable</label>
          <select
            id="staffAsistente"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
          >
            <option value="">Selecciona un staff</option>

            {staff.map((integrante) => (
              <option key={integrante.id} value={integrante.id}>
                {integrante.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-botones">
          <button
            className="modal-cancelar"
            type="button"
            onClick={alCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>

          <button
            className="modal-guardar"
            type="submit"
            disabled={guardando}
          >
            {guardando ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearAsistenteModal;