import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
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

export default Login;