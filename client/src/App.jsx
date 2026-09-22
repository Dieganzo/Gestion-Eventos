import React, { useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './styles/styles.css';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Inicio from './pages/Inicio.jsx';
import DetalleEvento from './pages/DetalleEvento.jsx';



const obtenerSesion = () => {
  const sesionGuardada = localStorage.getItem('sesion');
  return sesionGuardada ? JSON.parse(sesionGuardada) : null;
};


function RutaProtegida({ children }) {
  return obtenerSesion() ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/registro" element={<Registro />} />
  <Route path="/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />

  <Route
    path="/eventos/:id"
    element={
      <RutaProtegida>
        <DetalleEvento />
      </RutaProtegida>
    }
  />

  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
  );
}

export default App;
