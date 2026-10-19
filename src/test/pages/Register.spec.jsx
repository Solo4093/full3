import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Register from '../../pages/Register';
import { renderConProviders } from '../helpers';
import { usuariosIniciales } from '../../data/usuarios';

const [, cliente] = usuariosIniciales;

const pantalla = (
  <Routes>
    <Route path="/" element={<p>Pantalla inicio</p>} />
    <Route path="/registro" element={<Register />} />
  </Routes>
);

const campo = (etiqueta, valor) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

const completar = ({ correo = 'ana@mail.cl', password = '123456', confirmar = '123456' } = {}) => {
  campo('Nombre', 'Ana');
  campo('Apellidos', 'Pérez');
  campo('Correo', correo);
  campo('Contraseña', password);
  campo('Repetir contraseña', confirmar);
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
};

describe('Register (página)', () => {
  it('con el formulario vacío muestra los errores de validación', () => {
    renderConProviders(pantalla, '/registro');
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByText('El nombre debe tener al menos 3 caracteres')).toBeInTheDocument();
    expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
  });

  it('avisa cuando las contraseñas no coinciden', () => {
    renderConProviders(pantalla, '/registro');
    completar({ confirmar: 'distinta' });
    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    expect(localStorage.getItem('sesion')).toBeNull();
  });

  it('rechaza un correo que ya tiene cuenta', () => {
    renderConProviders(pantalla, '/registro');
    completar({ correo: cliente.correo });
    expect(screen.getByText('Ya existe una cuenta con ese correo')).toBeInTheDocument();
  });

  it('con datos válidos crea la cuenta, abre sesión y navega al inicio', () => {
    renderConProviders(pantalla, '/registro');
    completar();
    expect(screen.getByText('Pantalla inicio')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('sesion')).correo).toBe('ana@mail.cl');
  });
});
