import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventoService } from '../services/eventoService.js';
import { asistenteService } from '../services/asistenteService.js';
import { staffService } from '../services/staffService.js';
import CrearAsistenteModal from '../components/CrearAsistenteModal.jsx';
import '../styles/inicio.css';

function DetalleEvento() {
  const { id } = useParams();

  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [asistentes, setAsistentes] = useState([]);
  const [cargandoAsistentes, setCargandoAsistentes] = useState(true);
  const [errorAsistentes, setErrorAsistentes] = useState('');
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargandoEstadisticas, setCargandoEstadisticas] = useState(true);
  const [errorEstadisticas, setErrorEstadisticas] = useState('');
  const [staff, setStaff] = useState([]);
  const [mostrarModalAsistente, setMostrarModalAsistente] = useState(false);
  const [guardandoAsistente, setGuardandoAsistente] = useState(false);

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

  const cargarAsistentes = async () => {
    try {
      setCargandoAsistentes(true);
      setErrorAsistentes('');

      const datos = await asistenteService.listarPorEvento(id);
      setAsistentes(datos);
    } catch (errorActual) {
      setErrorAsistentes(errorActual.message);
    } finally {
      setCargandoAsistentes(false);
    }
  };

  const cargarEstadisticas = async () => {
  try {
    setCargandoEstadisticas(true);
    setErrorEstadisticas('');

    const datos = await asistenteService.obtenerEstadisticas(id);
    setEstadisticas(datos);
  } catch (errorActual) {
    setErrorEstadisticas(errorActual.message);
  } finally {
    setCargandoEstadisticas(false);
  }
};

  const cargarStaff = async () => {
  try {
    const datos = await staffService.listar();
    setStaff(datos);
  } catch (errorActual) {
    setErrorAsistentes(errorActual.message);
  }
};

const crearAsistente = async (nuevoAsistente) => {
  try {
    setGuardandoAsistente(true);
    setErrorAsistentes('');

    await asistenteService.crear(id, nuevoAsistente);

    setMostrarModalAsistente(false);

    await cargarAsistentes();
    await cargarEstadisticas();
  } catch (errorActual) {
    setErrorAsistentes(errorActual.message);
  } finally {
    setGuardandoAsistente(false);
  }
};


  useEffect(() => {
    cargarEvento();
    cargarAsistentes();
    cargarStaff();
    cargarEstadisticas();
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
            //cambiar esta parte 
            <section className="detalle-estadisticas">
              <h2>Estadísticas de asistencia</h2>
              <p>Resumen de ingreso de los asistentes del evento.</p>

              {cargandoEstadisticas && <p>Cargando estadísticas...</p>}

              {errorEstadisticas && (
                <p className="mensaje-error">{errorEstadisticas}</p>
              )}

              {!cargandoEstadisticas && !errorEstadisticas && estadisticas && (
                <div className="estadisticas-grid">
                  <article className="tarjeta-estadistica">
                    <span>Total de asistentes</span>
                    <strong>{estadisticas.total}</strong>
                  </article>

                  <article className="tarjeta-estadistica">
                    <span>Presentes</span>
                    <strong>{estadisticas.asistieron}</strong>
                  </article>

                  <article className="tarjeta-estadistica">
                    <span>Ausentes</span>
                    <strong>{estadisticas.no_asistieron}</strong>
                  </article>

                  <article className="tarjeta-estadistica">
                    <span>Porcentaje de asistencia</span>
                    <strong>{estadisticas.porcentaje_asistencia}%</strong>
                  </article>
                </div>
              )}
            </section>
            //cambiar esta parte estadistica 
            <section className="detalle-asistentes">
              <div className="detalle-seccion-encabezado">
                <div>
                <h2>Asistentes</h2>
                <p>Gestiona los asistentes registrados para este evento.</p>
                </div>
                <button
                    className="boton-agregar-asistente"
                    type="button"
                    onClick={() => setMostrarModalAsistente(true)}
                >
                    + Agregar asistente
                </button>
                </div>

              {cargandoAsistentes && <p>Cargando asistentes...</p>}

              {errorAsistentes && (
                <p className="mensaje-error">{errorAsistentes}</p>
              )}

              {!cargandoAsistentes &&
                !errorAsistentes &&
                asistentes.length === 0 && (
                  <div className="detalle-lista-vacia">
                    No hay asistentes registrados para este evento.
                  </div>
                )}

              {!cargandoAsistentes &&
                !errorAsistentes &&
                asistentes.length > 0 && (
                  <div className="lista-asistentes">
                    {asistentes.map((asistente) => (
                      <article
                        className="tarjeta-asistente"
                        key={asistente.id}
                      >
                        <div>
                          <h3>{asistente.nombre}</h3>
                          <p>RUT: {asistente.rut || 'Sin RUT'}</p>
                        </div>

                        <span>{asistente.staff_nombre}</span>
                      </article>
                    ))}
                  </div>
                )}
                {mostrarModalAsistente && (
                <CrearAsistenteModal
                    staff={staff}
                    alCerrar={() => setMostrarModalAsistente(false)}
                    alCrear={crearAsistente}
                    guardando={guardandoAsistente}
                />
                )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default DetalleEvento;