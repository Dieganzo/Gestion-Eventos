import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventoService } from '../services/eventoService.js';
import '../styles/inicio.css';

function DetalleEvento() {
  const { id } = useParams();

  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarEvento = async () => {
    try {
      setCargando(true);
      setError('');

      const datos = await eventoService.obtenerPorId(id);
      setEvento(datos);
    } catch (errorActual) {
      setError(errorActual.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEvento();
  }, [id]);

 return (
  <main className="inicio">
    <div className="inicio-contenedor detalle-evento">
      <header className="detalle-encabezado">
        <Link className="detalle-volver" to="/inicio">
          ← Volver a eventos
        </Link>

        {!cargando && !error && evento && (
          <div className="detalle-titulo">
            <h1>Gestión de evento</h1>
            <p>{evento.nombre}</p>
          </div>
        )}
      </header>

      <div className="inicio-linea" />

      {cargando && <p>Cargando evento...</p>}

      {error && <p className="mensaje-error">{error}</p>}

      {!cargando && !error && evento && (
        <>
          <section className="detalle-resumen">
            <span>EVENTO</span>
            <h2>{evento.nombre}</h2>
            <p>{evento.descripcion || 'Sin descripción'}</p>
          </section>

          <section className="detalle-asistentes">
            <div className="detalle-seccion-encabezado">
              <div>
                <h2>Asistentes</h2>
                <p>Gestiona los asistentes registrados para este evento.</p>
              </div>
            </div>

            <div className="detalle-lista-vacia">
              Aún no cargamos asistentes. Esta sección será el siguiente paso.
            </div>
          </section>
        </>
      )}
    </div>
  </main>
);

}

export default DetalleEvento;