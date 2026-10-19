import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import DetalleProducto from '../../pages/DetalleProducto';
import { actualizarConsola } from '../../data/consolas';
import { renderConProviders } from '../helpers';

const rutas = (
  <Routes>
    <Route path="/productos/:id" element={<DetalleProducto />} />
  </Routes>
);

describe('DetalleProducto (página)', () => {
  it('muestra los datos de la consola según el id de la URL', () => {
    renderConProviders(rutas, '/productos/4');
    expect(screen.getByRole('heading', { name: 'Playstation 4' })).toBeInTheDocument();
    expect(screen.getByText('Categoría: Sony')).toBeInTheDocument();
    expect(screen.getByText('Stock disponible: 12')).toBeInTheDocument();
    expect(screen.getByText('$187.493')).toBeInTheDocument();
  });

  it('con un id inexistente muestra "Producto no encontrado"', () => {
    renderConProviders(rutas, '/productos/999');
    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver a productos' })).toBeInTheDocument();
  });

  it('"Añadir al carrito" guarda el producto y avisa al usuario', () => {
    const alerta = spyOn(window, 'alert'); // mock: evita abrir la alerta real
    renderConProviders(rutas, '/productos/4');
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));
    expect(alerta).toHaveBeenCalled();
    expect(alerta.calls.mostRecent().args[0]).toMatch(/agreg|añad|carrito/i);
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([{ id: 4, cantidad: 1 }]);
  });

  it('avisa cuando ya no quedan unidades para agregar', () => {
    const alerta = spyOn(window, 'alert');
    actualizarConsola(4, { stock: 1 });
    renderConProviders(rutas, '/productos/4');
    const boton = screen.getByRole('button', { name: 'Añadir al carrito' });
    fireEvent.click(boton);
    fireEvent.click(boton);
    expect(alerta).toHaveBeenCalled();
    expect(alerta.calls.mostRecent().args[0]).toMatch(/stock|unidad|disponible|quedan/i);
    expect(JSON.parse(localStorage.getItem('carrito'))[0].cantidad).toBe(1);
  });
});