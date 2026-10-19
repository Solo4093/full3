import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Carrito from '../../pages/Carrito';
import { renderConProviders } from '../helpers';

const rutas = (
  <Routes>
    <Route path="/carrito" element={<Carrito />} />
    <Route path="/checkout" element={<p>Pantalla checkout</p>} />
    <Route path="/productos" element={<p>Pantalla productos</p>} />
  </Routes>
);

const llenarCarrito = () =>
  localStorage.setItem('carrito', JSON.stringify([{ id: 4, cantidad: 2 }, { id: 7, cantidad: 1 }]));

const MENSAJE_VACIO = /Tu carrito est[aá] vac[ií]o/i;

describe('Carrito (pagina)', () => {
  it('con el carrito vacio muestra un mensaje y un enlace a productos', () => {
    renderConProviders(rutas, '/carrito');
    expect(screen.getByText(MENSAJE_VACIO)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Ver productos' }));
    expect(screen.getByText('Pantalla productos')).toBeInTheDocument();
  });

  it('lista los productos con precio, cantidad, subtotal y el total', () => {
    llenarCarrito();
    renderConProviders(rutas, '/carrito');
    expect(screen.getByText('Playstation 4')).toBeInTheDocument();
    expect(screen.getByText('PSP')).toBeInTheDocument();
    expect(screen.getByText('$374986')).toBeInTheDocument();
    expect(screen.getByText('Total: $426980')).toBeInTheDocument();
  });

  it('el botón + sube la cantidad, recalcula el total y lo guarda', () => {
    llenarCarrito();
    renderConProviders(rutas, '/carrito');
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad de PSP' }));
    expect(screen.getByLabelText('Cantidad de PSP')).toHaveTextContent('2');
    expect(screen.getByText('Total: $478974')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('carrito'))[1].cantidad).toBe(2);
  });

  it('Eliminar quita solo ese producto', () => {
    llenarCarrito();
    renderConProviders(rutas, '/carrito');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar PSP' }));
    expect(screen.queryByText('PSP')).toBeNull();
    expect(screen.getByText('Total: $374986')).toBeInTheDocument();
  });

  it('Limpiar carrito lo vacia', () => {
    llenarCarrito();
    renderConProviders(rutas, '/carrito');
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar carrito' }));
    expect(screen.getByText(MENSAJE_VACIO)).toBeInTheDocument();
    expect(localStorage.getItem('carrito')).toBeNull();
  });

  it('Comprar ahora navega al checkout', () => {
    llenarCarrito();
    renderConProviders(rutas, '/carrito');
    fireEvent.click(screen.getByRole('button', { name: 'Comprar ahora' }));
    expect(screen.getByText('Pantalla checkout')).toBeInTheDocument();
  });
});