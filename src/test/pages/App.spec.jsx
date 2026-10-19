import { screen } from '@testing-library/react';
import App from '../../App';
import { renderConProviders } from '../helpers';

describe('App (enrutamiento de la tienda)', () => {
  it('en "/" muestra la cabecera, el menu, el inicio y el pie de pagina', () => {
    renderConProviders(<App />, '/');
    expect(screen.getByAltText('Logo Nexus Gaming')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ofertas' })).toBeInTheDocument();
    expect(screen.getByText('Bienvenido a Nexus Gaming')).toBeInTheDocument();
    expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument();
  });

  it('cada ruta carga su pagina', () => {
    const rutas = {
      '/nosotros': 'Nosotros',
      '/contacto': 'Contacto',
      '/ofertas': 'Ofertas',
      '/login': 'Iniciar sesión',
      '/registro': 'Crear cuenta',
      '/carrito': 'Carrito de compras',
      '/checkout': 'Checkout',
    };
    Object.entries(rutas).forEach(([ruta, titulo]) => {
      const { unmount } = renderConProviders(<App />, ruta);
      expect(screen.getByRole('heading', { name: titulo })).toBeInTheDocument();
      unmount();
    });
  });
});