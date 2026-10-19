import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '../../components/organisms/Header';
import { renderConProviders } from '../helpers';

const conRutas = (
  <>
    <Header />
    <Routes>
      <Route path="/login" element={<p>Pantalla login</p>} />
      <Route path="*" element={<p>Otra pantalla</p>} />
    </Routes>
  </>
);

const iniciarSesionComo = (nombre) =>
  localStorage.setItem('sesion', JSON.stringify({ id: 2, nombre, correo: 'cliente@nexus.cl' }));

describe('Header (organismo)', () => {
  it('sin sesion muestra Iniciar Sesión y Crear Cuenta', () => {
    renderConProviders(conRutas);
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear Cuenta' })).toBeInTheDocument();
    expect(screen.queryByText(/Hola,/)).toBeNull();
  });

  it('con sesion saluda al usuario y muestra Cerrar sesión', () => {
    iniciarSesionComo('Cliente');
    renderConProviders(conRutas);
    expect(screen.getByText('Hola, Cliente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Iniciar Sesión' })).toBeNull();
  });

  it('Cerrar sesión elimina la sesion y vuelve a mostrar Iniciar Sesión', () => {
    iniciarSesionComo('Cliente');
    renderConProviders(conRutas);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(localStorage.getItem('sesion')).toBeNull();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('Iniciar Sesión navega a /login', () => {
    renderConProviders(conRutas);
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));
    expect(screen.getByText('Pantalla login')).toBeInTheDocument();
  });
});