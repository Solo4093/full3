import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Blog from '../../pages/Blogs';
import DetalleBlog from '../../pages/DetalleBlog';
import { renderConProviders } from '../helpers';

const rutas = (
  <Routes>
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:id" element={<DetalleBlog />} />
  </Routes>
);

describe('Blog (paginas)', () => {
  it('lista las entradas del blog', () => {
    renderConProviders(rutas, '/blog');
    expect(screen.getByText('Cómo elegir tu próxima consola')).toBeInTheDocument();
    expect(screen.getAllByText('Leer más').length).toBe(2);
  });

  it('"Leer más" navega al detalle de la entrada', () => {
    renderConProviders(rutas, '/blog');
    fireEvent.click(screen.getAllByText('Leer más')[1]);
    expect(screen.getByRole('heading', { name: 'Consejos para cuidar tu consola' })).toBeInTheDocument();
  });

  it('con un id inexistente muestra "Entrada no encontrada"', () => {
    renderConProviders(rutas, '/blog/99');
    expect(screen.getByText('Entrada no encontrada')).toBeInTheDocument();
  });
});