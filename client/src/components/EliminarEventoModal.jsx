import React from 'react';

function EliminarEventoModal({ evento, alCerrar, alEliminar, guardando }) {
  return (
    <div className="modal-fondo" onClick={alCerrar}>
      <div
        className="modal-contenido"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-encabezado">
          <h2>Eliminar evento</h2>
        </div>

        <p className="modal-mensaje">
          ¿Seguro que deseas eliminar el evento{' '}
          <strong>{evento.nombre}</strong>?
        </p>

        <p className="modal-advertencia">
          Esta acción también eliminará sus asistentes asociados y no se puede
          deshacer.
        </p>

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
            className="modal-eliminar"
            type="button"
            onClick={alEliminar}
            disabled={guardando}
          >
            {guardando ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EliminarEventoModal;