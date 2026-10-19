import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Categorias from '../../pages/Categorias';
import { renderConProviders } from '../helpers';

const rutas = (
  <Routes>
    <Route path="/categorias" element={<Categorias />} />
    <Route path="/categorias/:categoria" element={<Categorias />} />
  </Routes>
);

const tarjetas = (container) => container.querySelectorAll('.caluga');

describe('Categorias (pagina)', () => {
  it('lista las categorias sin repetir', () => {
    renderConProviders(rutas, '/categorias');
    ['Sony', 'Microsoft', 'Nintendo'].forEach((cat) =>
      expect(screen.getAllByRole('link', { name: cat }).length).toBe(1)
    );
  });

  it('sin categoria seleccionada muestra todas las consolas', () => {
    const { container } = renderConProviders(rutas, '/categorias');
    expect(screen.getByText('Todas las consolas')).toBeInTheDocument();
    expect(tarjetas(container).length).toBe(8);
  });

  it('con una categoria en la URL filtra y marca el chip como activo', () => {
    const { container } = renderConProviders(rutas, '/categorias/Sony');
    expect(tarjetas(container).length).toBe(3);
    expect(screen.getByRole('link', { name: 'Sony' })).toHaveClass('activa');
    expect(screen.getByRole('link', { name: 'Nintendo' })).not.toHaveClass('activa');
  });

  it('con una categoria inexistente muestra un mensaje', () => {
    renderConProviders(rutas, '/categorias/Atari');
    expect(screen.getByText('No hay consolas en esta categoria.')).toBeInTheDocument();
  });
});
