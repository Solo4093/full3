import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/organisms/AdminLayout';
import { renderConProviders } from '../helpers';

const panel = (
  <Routes>
    <Route
      path="/admin"
      element={<AdminLayout><p>Contenido del panel</p></AdminLayout>}
    />
    <Route path="/login" element={<p>Pantalla de login</p>} />
  </Routes>
);

const iniciarSesion = (rol) =>
  localStorage.setItem('sesion', JSON.stringify({ id: 1, nombre: 'Test', rol }));

describe('AdminLayout', () => {
  it('muestra el panel a un administrador', () => {
    iniciarSesion('admin');
    renderConProviders(panel, '/admin');

    expect(screen.getByText('Nexus Admin')).toBeTruthy();
    expect(screen.getByText('Contenido del panel')).toBeTruthy();
  });

  it('manda al login a un cliente', () => {
    iniciarSesion('cliente');
    renderConProviders(panel, '/admin');

    expect(screen.getByText('Pantalla de login')).toBeTruthy();
    expect(screen.queryByText('Contenido del panel')).toBeNull();
  });

  it('manda al login si no hay sesión', () => {
    renderConProviders(panel, '/admin');

    expect(screen.getByText('Pantalla de login')).toBeTruthy();
  });
});