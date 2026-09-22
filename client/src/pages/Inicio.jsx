import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventoService } from '../services/eventoService.js';
import ListaEventos from '../components/ListaEventos.jsx';
import CrearEventoModal from '../components/CrearEventoModal.jsx';
import EditarEventoModal from '../components/EditarEventoModal.jsx';
import EliminarEventoModal from '../components/EliminarEventoModal.jsx';
import { staffService } from '../services/staffService.js';
import CrearAsistenteModal from '../components/CrearAsistenteModal.jsx';
import '../styles/styles.css';
import '../styles/inicio.css';

const obtenerSesion = () => {
  const sesionGuardada = localStorage.getItem('sesion');
  return sesionGuardada ? JSON.parse(sesionGuardada) : null;
};

function Inicio() {
  const navegar = useNavigate();
  const sesion = obtenerSesion();
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const esAdmin = sesion.usuario.rol === 'admin'; 
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [eventoEliminando, setEventoEliminando] = useState(null);
  const [staff, setStaff] = useState([]);
  const [mostrarModalAsistente, setMostrarModalAsistente] = useState(false);
  const [guardandoAsistente, setGuardandoAsistente] = useState(false);


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
  <main className="inicio">
    <div className="inicio-contenedor">
      <header className="inicio-encabezado">
        <div>
          <h1>Eventos</h1>
          <p>Gestiona tus eventos y asistentes</p>
        </div>

        <div className="inicio-usuario">
          <span>
            {sesion.usuario.nombre} · {sesion.usuario.rol}
          </span>
        {esAdmin && (
        <button
        className="boton-crear-evento"
        type="button"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? 'Cancelar' : '+ Crear evento'}
        </button>
        )}
          <button type="button" onClick={cerrarSesion}>
            Salir
          </button>
        </div>
      </header>

      <div className="inicio-linea" />
      {esAdmin && mostrarFormulario && (
      <CrearEventoModal
      alCerrar={() => setMostrarFormulario(false)}
      alCrear={crearEvento}
      guardando={guardando}
  />)}
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
      <section className="inicio-contenido">
        <h2>Lista de eventos</h2>
        {cargando && <p>Cargando eventos...</p>}

{error && <p className="mensaje-error">{error}</p>}

{!cargando && !error && eventos.length === 0 && (
  <p>No hay eventos registrados.</p>
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