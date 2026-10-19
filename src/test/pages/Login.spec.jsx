import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Login from '../../pages/Login';
import { renderConProviders } from '../helpers';
import { usuariosIniciales } from '../../data/usuarios';

const [admin, cliente] = usuariosIniciales;

const pantalla = (
  <Routes>
    <Route path="/" element={<p>Pantalla inicio</p>} />
    <Route path="/login" element={<Login />} />
  </Routes>
);

const completar = (correo, password) => {
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
};

describe('Login (página)', () => {
  it('con los campos vacíos muestra los errores de validación', () => {
    renderConProviders(pantalla, '/login');
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu contraseña')).toBeInTheDocument();
  });

  it('con credenciales incorrectas muestra el error y no abre sesión', () => {
    renderConProviders(pantalla, '/login');
    completar(admin.correo, 'incorrecta');
    expect(screen.getByText('Correo o contraseña incorrectos')).toBeInTheDocument();
    expect(localStorage.getItem('sesion')).toBeNull();
  });

  it('con credenciales correctas abre sesión y navega al inicio', () => {
    renderConProviders(pantalla, '/login');
    completar(cliente.correo, cliente.password);
    expect(screen.getByText('Pantalla inicio')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('sesion')).nombre).toBe(cliente.nombre);
  });
});
