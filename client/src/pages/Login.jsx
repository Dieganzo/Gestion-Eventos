import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No fue posible iniciar sesion');
      }

      localStorage.setItem('sesion', JSON.stringify(datos));
      navegar('/inicio');
    } catch (errorActual) {
      setError(errorActual.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#121216] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">
            Iniciar sesion
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={iniciarSesion} className="space-y-4">
          <div>
            <label
              htmlFor="correo"
              className="mb-1 block text-sm text-zinc-400"
            >
              Correo electronico
            </label>

            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              placeholder="correo@ejemplo.cl"
              autoFocus
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="contrasena"
              className="mb-1 block text-sm text-zinc-400"
            >
              Contrasena
            </label>

            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              placeholder="Tu contrasena"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-red-600 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
             className="w-full rounded-lg !bg-[#B11226] py-2.5 text-sm font-medium text-white transition hover:!bg-[#8F0E20] focus:outline-none focus:ring-2 focus:ring-[#D64A5A] disabled:cursor-not-allowed disabled:opacity-60"   >
            {cargando ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </form>


      </div>
    </main>
  );
}

export default Login;