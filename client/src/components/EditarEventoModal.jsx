import React, { useState } from 'react';

function EditarEventoModal({ evento, alCerrar, alEditar, guardando }) {
  const [nombre, setNombre] = useState(evento.nombre);
  const [descripcion, setDescripcion] = useState(evento.descripcion || '');

  const enviarFormulario = async (e) => {
    e.preventDefault();

    await alEditar({
      nombre,
      descripcion
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
          <h2>Editar evento</h2>
        </div>

        <div className="modal-grupo">
          <label htmlFor="editarNombre">Nombre del evento</label>
          <input
            id="editarNombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="modal-grupo">
          <label htmlFor="editarDescripcion">Descripción</label>
          <textarea
            id="editarDescripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
          />
        </div>

        <div className="modal-botones">
          <button
            className="modal-cancelar"
            type="button"
            onClick={alCerrar}
          >
            Cancelar
          </button>

          <button
            className="modal-guardar"
            type="submit"
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarEventoModal;