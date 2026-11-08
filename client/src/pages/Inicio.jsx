import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventoService } from '../services/eventoService.js';
import ListaEventos from '../components/ListaEventos.jsx';
import CrearEventoModal from '../components/CrearEventoModal.jsx';
import EditarEventoModal from '../components/EditarEventoModal.jsx';
import EliminarEventoModal from '../components/EliminarEventoModal.jsx';
import '../styles/inicio.css';

const obtenerSesion = () => {
  const sesionGuardada = localStorage.getItem('sesion');
  return sesionGuardada ? JSON.parse(sesionGuardada) : null;
};

function Inicio() {
  const navegar = useNavigate();
  const sesion = obtenerSesion();
  const usuario = sesion?.usuario;
  const esAdmin = usuario?.rol === 'admin';

  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [eventoEliminando, setEventoEliminando] = useState(null);

  const cargarEventos = async () => {
    try {
      setCargando(true);
      setError('');

      const datos = await eventoService.listar();
      setEventos(datos);
    } catch (errorActual) {
      setError(errorActual.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const crearEvento = async (nuevoEvento) => {
    try {
      setGuardando(true);
      setError('');

      await eventoService.crear(nuevoEvento);
      setMostrarFormulario(false);
      await cargarEventos();
    } catch (errorActual) {
      setError(errorActual.message);
    } finally {
      setGuardando(false);
    }
  };

  const actualizarEvento = async (datosActualizados) => {
    try {
      setGuardando(true);
      setError('');

      await eventoService.actualizar(
        eventoEditando.id,
        datosActualizados
      );

      setEventoEditando(null);
      await cargarEventos();
    } catch (errorActual) {
      setError(errorActual.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarEvento = async () => {
    try {
      setGuardando(true);
      setError('');

      await eventoService.eliminar(eventoEliminando.id);
      setEventoEliminando(null);
      await cargarEventos();
    } catch (errorActual) {
      setError(errorActual.message);
    } finally {
      setGuardando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('sesion');
    navegar('/');
  };

  return (
    <main className="min-h-screen bg-[#121216] px-4 py-10 text-zinc-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Eventos
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                Gestiona tus eventos y asistentes
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-zinc-500">
                {usuario?.nombre || 'Usuario'}
                <span className="text-zinc-700">
                  {' | '} {usuario?.rol || 'sin rol'}
                </span>
              </span>

              {esAdmin && (
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="inline-flex !w-auto !m-0 items-center justify-center rounded-lg !bg-[#B11226] px-4 py-2.5 text-sm font-medium text-white transition hover:!bg-[#8F0E20]"
                >
                  {mostrarFormulario ? 'Cancelar' : '+ Crear evento'}
                </button>
              )}

              <button
                type="button"
                onClick={cerrarSesion}
                className="!w-auto !m-0 rounded-lg !bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:!bg-zinc-700"
              >
                Salir
              </button>
            </div>
          </div>

          <div className="mt-5 h-0.5 rounded-full bg-gradient-to-r from-[#B11226] via-[#D64A5A] to-transparent" />
        </header>

        {esAdmin && mostrarFormulario && (
          <CrearEventoModal
            alCerrar={() => setMostrarFormulario(false)}
            alCrear={crearEvento}
            guardando={guardando}
          />
        )}

        {esAdmin && eventoEditando && (
          <EditarEventoModal
            evento={eventoEditando}
            alCerrar={() => setEventoEditando(null)}
            alEditar={actualizarEvento}
            guardando={guardando}
          />
        )}

        {esAdmin && eventoEliminando && (
          <EliminarEventoModal
            evento={eventoEliminando}
            alCerrar={() => setEventoEliminando(null)}
            alEliminar={eliminarEvento}
            guardando={guardando}
          />
        )}

        <section>
          <h2 className="mb-6 text-xl font-semibold text-white">
            Lista de eventos
          </h2>

          {cargando && (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B11226] border-t-transparent" />
              <p className="text-sm text-zinc-500">Cargando eventos...</p>
            </div>
          )}

          {error && <p className="mensaje-error">{error}</p>}

          {!cargando && !error && eventos.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-700 py-12 text-center text-zinc-500">
              No hay eventos registrados.
            </div>
          )}

          {!cargando && !error && eventos.length > 0 && (
            <ListaEventos
              eventos={eventos}
              esAdmin={esAdmin}
              alEditar={(evento) => setEventoEditando(evento)}
              alEliminar={(evento) => setEventoEliminando(evento)}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default Inicio;