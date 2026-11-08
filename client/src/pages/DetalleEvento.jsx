import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventoService } from '../services/eventoService.js';
import { asistenteService } from '../services/asistenteService.js';
import { staffService } from '../services/staffService.js';
import CrearAsistenteModal from '../components/CrearAsistenteModal.jsx';
import '../styles/detalle-evento.css';

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

  const [busqueda, setBusqueda] = useState('');
  const [tipoBusqueda, setTipoBusqueda] = useState('asistente');

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

  const cambiarAsistencia = async (asistenteId, asistio) => {
    try {
      setErrorAsistentes('');

      await asistenteService.actualizarAsistencia(
        id,
        asistenteId,
        asistio
      );

      await cargarAsistentes();
      await cargarEstadisticas();
    } catch (errorActual) {
      setErrorAsistentes(errorActual.message);
    }
  };
  const asistentesFiltrados = asistentes.filter((asistente) => {
  const texto = busqueda.toLowerCase().trim();

      if (!texto) {
        return true;
      }

      if (tipoBusqueda === 'staff') {
        return (asistente.staff_nombre || '')
          .toLowerCase()
          .includes(texto);
      }

      return (
        asistente.nombre.toLowerCase().includes(texto) ||
        (asistente.rut || '').toLowerCase().includes(texto)
      );
});


  useEffect(() => {
    cargarEvento();
    cargarAsistentes();
    cargarStaff();
    cargarEstadisticas();
  }, [id]);

  return (
    <main className="min-h-screen bg-[#121216] px-4 py-6 text-zinc-100 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/inicio"
              className="inline-flex items-center gap-2 text-sm font-medium text-red-400 transition hover:text-red-300"
            >
              <span className="text-lg">←</span>
              <span>Volver a eventos</span>
            </Link>

            {!cargando && !error && evento && (
              <>
                <div className="hidden h-9 w-1 rounded-full bg-gradient-to-b from-[#B11226] to-transparent sm:block" />

                <div>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    Gestion de evento
                  </h1>

                  <p className="mt-1 text-sm text-zinc-500">
                    {evento.nombre}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-5 h-0.5 rounded-full bg-gradient-to-r from-[#B11226] via-[#D64A5A] to-transparent" />
        </header>

        {cargando && (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B11226] border-t-transparent" />
            <p className="text-sm text-zinc-500">Cargando evento...</p>
          </div>
        )}

        {error && <p className="mensaje-error">{error}</p>}

        {!cargando && !error && evento && (
          <>
            <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
              <span className="text-xs font-bold tracking-[0.15em] text-red-400">
                EVENTO
              </span>

              <h2 className="mt-3 text-2xl font-bold text-white">
                {evento.nombre}
              </h2>

              <p className="mt-3 text-zinc-400">
                {evento.descripcion || 'Sin descripcion'}
              </p>
            </section>

            <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">
                  Estadisticas de asistencia
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Resumen de ingreso de los asistentes del evento.
                </p>
              </div>

              {cargandoEstadisticas && (
                <p className="text-sm text-zinc-500">
                  Cargando estadisticas...
                </p>
              )}

              {errorEstadisticas && (
                <p className="mensaje-error">{errorEstadisticas}</p>
              )}

              {!cargandoEstadisticas &&
                !errorEstadisticas &&
                estadisticas && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <article className="rounded-xl border border-zinc-800 bg-[#18181d] p-5">
                      <span className="text-sm text-zinc-500">
                        Total de asistentes
                      </span>
                      <strong className="mt-3 block text-3xl font-bold text-white">
                        {estadisticas.total}
                      </strong>
                    </article>

                    <article className="rounded-xl border border-zinc-800 bg-[#18181d] p-5">
                      <span className="text-sm text-zinc-500">
                        Presentes
                      </span>
                      <strong className="mt-3 block text-3xl font-bold text-emerald-400">
                        {estadisticas.asistieron}
                      </strong>
                    </article>

                    <article className="rounded-xl border border-zinc-800 bg-[#18181d] p-5">
                      <span className="text-sm text-zinc-500">
                        Ausentes
                      </span>
                      <strong className="mt-3 block text-3xl font-bold text-red-400">
                        {estadisticas.no_asistieron}
                      </strong>
                    </article>

                    <article className="rounded-xl border border-zinc-800 bg-[#18181d] p-5">
                      <span className="text-sm text-zinc-500">
                        Porcentaje de asistencia
                      </span>
                      <strong className="mt-3 block text-3xl font-bold text-white">
                        {estadisticas.porcentaje_asistencia}%
                      </strong>
                    </article>
                  </div>
                )}
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Asistentes
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Gestiona los asistentes registrados para este evento.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMostrarModalAsistente(true)}
                  className="!m-0 inline-flex !w-auto items-center justify-center rounded-lg !bg-[#B11226] px-4 py-2.5 text-sm font-medium text-white transition hover:!bg-[#8F0E20]"
                >
                  + Agregar asistente
                </button>
              </div>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder={
                    tipoBusqueda === 'staff'
                      ? 'Buscar por nombre del staff...'
                      : 'Buscar por nombre o RUT...'
                  }
                  className="!w-full !rounded-lg !border !border-zinc-700 !bg-zinc-950 !px-3 !py-2.5 !text-sm !text-white placeholder:!text-zinc-600 focus:!border-[#B11226] focus:outline-none"
                />

                <select
                  value={tipoBusqueda}
                  onChange={(evento) => setTipoBusqueda(evento.target.value)}
                  className="!w-full !rounded-lg !border !border-zinc-700 !bg-zinc-950 !px-3 !py-2.5 !text-sm !text-white focus:!border-[#B11226] focus:outline-none sm:!w-44"
                >
                  <option value="asistente">Asistente</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              {cargandoAsistentes && (
                <p className="text-sm text-zinc-500">
                  Cargando asistentes...
                </p>
              )}

              {errorAsistentes && (
                <p className="mensaje-error">{errorAsistentes}</p>
              )}

              {!cargandoAsistentes &&
                !errorAsistentes &&
                asistentes.length === 0 && (
                  <div className="rounded-xl border border-dashed border-zinc-700 py-12 text-center text-zinc-500">
                    No hay asistentes registrados para este evento.
                  </div>
                )}
      
              {!cargandoAsistentes &&
                !errorAsistentes &&
                asistentesFiltrados.length > 0 && (
                  <div className="space-y-3">
                    {asistentesFiltrados.map((asistente) => (
                      <article
                        key={asistente.id}
                        className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-[#18181d] p-5 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {asistente.nombre}
                          </h3>

                          <p className="mt-1 text-sm text-zinc-500">
                            RUT: {asistente.rut || 'Sin RUT'}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 lg:items-end">
                          <span className="w-fit rounded-full bg-[#3f1d28] px-3 py-1.5 text-xs font-semibold text-red-300">
                            {asistente.staff_nombre || 'Sin staff asignado'}
                          </span>

                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={
                                asistente.asistio === true
                                  ? 'rounded-full bg-emerald-950 px-3 py-1.5 text-xs font-semibold text-emerald-400'
                                  : 'rounded-full bg-red-950 px-3 py-1.5 text-xs font-semibold text-red-400'
                              }
                            >
                              {asistente.asistio === true
                                ? 'Presente'
                                : 'Ausente'}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                cambiarAsistencia(asistente.id, true)
                              }
                              disabled={asistente.asistio === true}
                              className="!m-0 !w-auto rounded-md !bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white transition hover:!bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Presente
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                cambiarAsistencia(asistente.id, false)
                              }
                              disabled={asistente.asistio === false}
                              className="!m-0 !w-auto rounded-md !bg-zinc-700 px-3 py-1.5 text-xs font-medium text-white transition hover:!bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Ausente
                            </button>
                          </div>
                        </div>
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