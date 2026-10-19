import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Checkout from '../../pages/Checkout';
import { obtenerConsolas } from '../../data/consolas';
import { obtenerPedidos } from '../../data/pedidos';
import { renderConProviders } from '../helpers';

const rutas = (
  <Routes>
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/productos" element={<p>Pantalla productos</p>} />
    <Route path="/compra-exitosa/:nro" element={<p>Pantalla compra exitosa</p>} />
    <Route path="/compra-fallida/:nro" element={<p>Pantalla compra fallida</p>} />
  </Routes>
);

const llenarCarrito = () =>
  localStorage.setItem('carrito', JSON.stringify([{ id: 4, cantidad: 2 }]));

const campo = (etiqueta, valor) =>
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

const completarFormulario = () => {
  campo('Nombre', 'Ana');
  campo('Apellidos', 'Pérez');
  campo('Correo', 'ana@correo.cl');
  campo('Calle', 'Los Alerces 123');
  campo('Región', 'Región Metropolitana de Santiago');
  campo('Comuna', 'Maipú');
};

const pagar = () => fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

describe('Checkout (pagina)', () => {
  it('con el carrito vacio no muestra el formulario', () => {
    renderConProviders(rutas, '/checkout');
    expect(screen.getByText('No tienes productos en el carrito.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pagar ahora/ })).toBeNull();
  });

  it('muestra el resumen de productos y el total a pagar', () => {
    llenarCarrito();
    renderConProviders(rutas, '/checkout');
    expect(screen.getByText('Playstation 4')).toBeInTheDocument();
    expect(screen.getByText('Total a pagar: $374986')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pagar ahora $374986' })).toBeInTheDocument();
  });

  it('sin sesion los datos del cliente aparecen vacios', () => {
    llenarCarrito();
    renderConProviders(rutas, '/checkout');
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
    expect(screen.getByLabelText('Correo')).toHaveValue('');
  });

  it('con sesión iniciada completa solos nombre, apellidos y correo', () => {
    llenarCarrito();
    localStorage.setItem('sesion', JSON.stringify({
      id: 2, nombre: 'vicente', apellidos: 'vasquez', correo: 'vicente6@gmail.com',
    }));
    renderConProviders(rutas, '/checkout');
    expect(screen.getByLabelText('Nombre')).toHaveValue('vicente');
    expect(screen.getByLabelText('Apellidos')).toHaveValue('vasquez');
    expect(screen.getByLabelText('Correo')).toHaveValue('vicente6@gmail.com');
  });

  it('solo permite la Región Metropolitana y ofrece sus comunas', () => {
    llenarCarrito();
    renderConProviders(rutas, '/checkout');
    const regiones = [...screen.getByLabelText('Región').querySelectorAll('option')].map((o) => o.textContent);
    expect(regiones).toEqual(['Selecciona una región', 'Región Metropolitana de Santiago']);
    expect(screen.getByLabelText('Comuna').querySelectorAll('option').length).toBe(1);
    campo('Región', 'Región Metropolitana de Santiago');
    const comunas = [...screen.getByLabelText('Comuna').querySelectorAll('option')].map((o) => o.textContent);
    expect(comunas[0]).toBe('Selecciona una comuna');
    expect(comunas).toContain('Cerrillos');
    expect(comunas).toContain('Maipú');
  });

  it('con el formulario vacío muestra los errores y no crea el pedido', () => {
    llenarCarrito();
    renderConProviders(rutas, '/checkout');
    pagar();
    expect(screen.getByText('Ingresa tu nombre')).toBeInTheDocument();
    expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
    expect(screen.getByText('Ingresa la calle y el número')).toBeInTheDocument();
    expect(screen.getByText('Debes seleccionar una región')).toBeInTheDocument();
    expect(screen.getByText('Debes seleccionar una comuna')).toBeInTheDocument();
    expect(obtenerPedidos()).toEqual([]);
  });

  it('pago aprobado: crea el pedido, vacía el carrito, descuenta stock y va a compra exitosa', () => {
    spyOn(Math, 'random').and.returnValue(0.9); // mock: la pasarela aprueba
    llenarCarrito();
    renderConProviders(rutas, '/checkout');
    completarFormulario();
    pagar();

    expect(screen.getByText('Pantalla compra exitosa')).toBeInTheDocument();
    expect(obtenerPedidos()[0].estado).toBe('pagado');
    expect(localStorage.getItem('carrito')).toBeNull();
    expect(obtenerConsolas().find((c) => c.id === 4).stock).toBe(10);
  });

  it('pago rechazado: conserva el carrito y va a compra fallida', () => {
    spyOn(Math, 'random').and.returnValue(0.1); // mock: la pasarela rechaza
    llenarCarrito();
    renderConProviders(rutas, '/checkout');
    completarFormulario();
    pagar();

    expect(screen.getByText('Pantalla compra fallida')).toBeInTheDocument();
    expect(obtenerPedidos()[0].estado).toBe('rechazado');
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([{ id: 4, cantidad: 2 }]);
    expect(obtenerConsolas().find((c) => c.id === 4).stock).toBe(12);
  });
});