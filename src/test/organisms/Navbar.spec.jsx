import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar, Footer } from '../../components/organisms/Navbar';
import { CartProvider } from '../../components/organisms/CartContext';

const renderNavbar = (ruta = '/') =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <CartProvider><Navbar /></CartProvider>
    </MemoryRouter>
  );

describe('Navbar y Footer (organismos)', () => {
  it('muestra los enlaces de la tienda apuntando a su ruta', () => {
    renderNavbar();
    const rutas = {
      Home: '/',
      Productos: '/productos',
      Categorías: '/categorias',
      Ofertas: '/ofertas',
      Nosotros: '/nosotros',
      Blog: '/blog',
      Contacto: '/contacto',
    };
    Object.entries(rutas).forEach(([texto, ruta]) => {
      expect(screen.getByRole('link', { name: texto })).toHaveAttribute('href', ruta);
    });
  });

  it('marca como activo el enlace de la ruta actual', () => {
    renderNavbar('/ofertas');
    expect(screen.getByRole('link', { name: 'Ofertas' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass('active');
  });

  it('el boton del carrito apunta a /carrito y parte en $0', () => {
    renderNavbar();
    const carrito = screen.getByRole('link', { name: /🛒/ });
    expect(carrito).toHaveAttribute('href', '/carrito');
    expect(carrito).toHaveTextContent('$0');
  });

  it('el boton del carrito muestra el total de los productos guardados', () => {
    // 2 x Playstation 4 ($187.493 c/u con descuento)
    localStorage.setItem('carrito', JSON.stringify([{ id: 4, cantidad: 2 }]));
    renderNavbar();
    expect(screen.getByRole('link', { name: /🛒/ })).toHaveTextContent(/\$374\.?986/);
  });

  it('el Footer muestra el año actual', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});