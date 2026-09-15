import React, { useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const obtenerSesion = () => {
  const sesionGuardada = localStorage.getItem('sesion');
  return sesionGuardada ? JSON.parse(sesionGuardada) : null;
};

function Login() {
  const navegar = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (evento) => {
    evento.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });
      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.error || 'No fue posible iniciar sesión');

      localStorage.setItem('sesion', JSON.stringify(datos));
      navegar('/inicio');
    } catch (errorActual) {
      setError(errorActual.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="pagina-autenticacion">
      <form className="tarjeta" onSubmit={iniciarSesion}>
        <h1>Gestión de Eventos</h1>
        <p className="subtitulo">Inicia sesión para continuar</p>

        <label htmlFor="correo">Correo</label>
        <input id="correo" type="email" value={correo} onChange={(evento) => setCorreo(evento.target.value)} placeholder="correo@ejemplo.cl" required />

        <label htmlFor="contrasena">Contraseña</label>
        <input id="contrasena" type="password" value={contrasena} onChange={(evento) => setContrasena(evento.target.value)} placeholder="Tu contraseña" required />

        {error && <p className="mensaje-error">{error}</p>}

        <button type="submit" disabled={cargando}>{cargando ? 'Ingresando...' : 'Iniciar sesión'}</button>
        <p className="enlace-secundario">¿No tienes una cuenta? <Link to="/registro">Crear usuario</Link></p>
      </form>
    </main>
  );
}

function Registro() {
  const navegar = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const registrarUsuario = async (evento) => {
    evento.preventDefault();
    setError('');
    setMensaje('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena })
      });
      const datos = await respuesta.json();

      if (!respuesta.ok) throw new Error(datos.error || 'No fue posible crear el usuario');

      setMensaje('Usuario creado como staff. Ahora puedes iniciar sesión.');
      setTimeout(() => navegar('/'), 1200);
    } catch (errorActual) {
      setError(errorActual.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="pagina-autenticacion">
      <form className="tarjeta" onSubmit={registrarUsuario}>
        <h1>Crear usuario</h1>
        <p className="subtitulo">Las cuentas nuevas se crean con rol staff.</p>

        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" type="text" value={nombre} onChange={(evento) => setNombre(evento.target.value)} placeholder="Tu nombre" required />

        <label htmlFor="correo">Correo</label>
        <input id="correo" type="email" value={correo} onChange={(evento) => setCorreo(evento.target.value)} placeholder="correo@ejemplo.cl" required />

        <label htmlFor="contrasena">Contraseña</label>
        <input id="contrasena" type="password" value={contrasena} onChange={(evento) => setContrasena(evento.target.value)} placeholder="Mínimo 8 caracteres" minLength="8" required />

        {error && <p className="mensaje-error">{error}</p>}
        {mensaje && <p className="mensaje-exito">{mensaje}</p>}

        <button type="submit" disabled={cargando}>{cargando ? 'Creando...' : 'Crear usuario'}</button>
        <p className="enlace-secundario"><Link to="/">Volver al inicio de sesión</Link></p>
      </form>
    </main>
  );
}

function Inicio() {
  const navegar = useNavigate();
  const sesion = obtenerSesion();

  const cerrarSesion = () => {
    localStorage.removeItem('sesion');
    navegar('/');
  };

  return (
    <main className="pagina-autenticacion">
      <section className="tarjeta">
        <h1>Bienvenido, {sesion.usuario.nombre}</h1>
        <p className="subtitulo">Rol: {sesion.usuario.rol}</p>
        <p>El inicio de sesión funciona correctamente.</p>
        <button type="button" onClick={cerrarSesion}>Cerrar sesión</button>
      </section>
    </main>
  );
}

function RutaProtegida({ children }) {
  return obtenerSesion() ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
