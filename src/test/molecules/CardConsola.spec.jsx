import { render, screen, fireEvent } from '@testing-library/react';
import CardConsola from '../../components/molecules/CardConsola';

const IMAGEN = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
const base = { nombre: 'Playstation 4', imagen: IMAGEN, precio: 187493 };

describe('CardConsola (molecula)', () => {
  it('muestra nombre, imagen y precio recibidos por props', () => {
    render(<CardConsola {...base} />);
    expect(screen.getByRole('heading', { name: 'Playstation 4' })).toBeInTheDocument();
    expect(screen.getByAltText('Playstation 4')).toHaveAttribute('src', IMAGEN);
    expect(screen.getByText('$187.493')).toBeInTheDocument();
  });

  it('muestra la insignia de descuento solo cuando descuento > 0', () => {
    const { rerender } = render(<CardConsola {...base} descuento={25} precioOriginal={249990} />);
    expect(screen.getByText('-25%')).toBeInTheDocument();
    rerender(<CardConsola {...base} descuento={0} />);
    expect(screen.queryByText('-25%')).toBeNull();
  });

  it('muestra "Ver detalles" solo si recibe onVerDetalle y lo ejecuta al hacer clic', () => {
    const onVerDetalle = jasmine.createSpy('onVerDetalle');
    const { rerender } = render(<CardConsola {...base} />);
    expect(screen.queryByText('Ver detalles')).toBeNull();

    rerender(<CardConsola {...base} onVerDetalle={onVerDetalle} />);
    fireEvent.click(screen.getByText('Ver detalles'));
    expect(onVerDetalle).toHaveBeenCalledTimes(1);
  });

  it('ejecuta onAgregar al presionar Comprar', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    render(<CardConsola {...base} onAgregar={onAgregar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Comprar' }));
    expect(onAgregar).toHaveBeenCalledTimes(1);
  });
});