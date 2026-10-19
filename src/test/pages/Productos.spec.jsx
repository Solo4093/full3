import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Productos from '../../pages/Productos';
import { renderConProviders } from '../helpers';

const rutas = (
  <Routes>
    <Route path="/productos" element={<Productos />} />
    <Route path="/productos/:id" element={<p>Detalle del producto</p>} />
  </Routes>
);

describe('Productos (página)', () => {
  it('muestra el catálogo completo', () => {
    const { container } = renderConProviders(rutas, '/productos');
    expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument();
    expect(container.querySelectorAll('.caluga').length).toBe(8);
  });

  it('"Comprar" guarda el producto en el carrito', () => {
    renderConProviders(rutas, '/productos');
    fireEvent.click(screen.getAllByRole('button', { name: 'Comprar' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Comprar' })[0]);
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([{ id: 1, cantidad: 2 }]);
  });

  it('"Ver detalles" navega a la página del producto', () => {
    renderConProviders(rutas, '/productos');
    fireEvent.click(screen.getAllByRole('button', { name: 'Ver detalles' })[0]);
    expect(screen.getByText('Detalle del producto')).toBeInTheDocument();
  });
});