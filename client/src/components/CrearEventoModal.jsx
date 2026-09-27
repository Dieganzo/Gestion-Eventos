import React, { useState } from 'react';

function CrearEventoModal({ alCerrar, alCrear, guardando }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const enviarFormulario = async (evento) => {
    evento.preventDefault();

    await alCrear({
      nombre,
      descripcion
    });
  };

  return (
    <div className="modal-fondo" onClick={alCerrar}>
      <form
        className="modal-contenido"
        onSubmit={enviarFormulario}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="modal-encabezado">
          <h2>Crear evento</h2>
        </div>

        <div className="modal-grupo">
          <label htmlFor="nombreEvento">Nombre del evento</label>

          <input
            id="nombreEvento"
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Ej: Capacitación 2024"
            autoFocus
            required
          />
        </div>

        <div className="modal-grupo">
          <label htmlFor="descripcionEvento">Descripción</label>

          <textarea
            id="descripcionEvento"
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            placeholder="Descripción del evento..."
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
            {guardando ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearEventoModal;