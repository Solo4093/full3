import { render } from '@testing-library/react';
import Precio from '../../components/atoms/Precio';

describe('Precio (atomo)', () => {
  it('formatea el precio con separador de miles chileno', () => {
    const { container } = render(<Precio precio={659990} />);
    expect(container.querySelector('.precio-final')).toHaveTextContent('$659.990');
  });

  it('muestra el precio original tachado cuando hay descuento (renderizado condicional)', () => {
    const { container } = render(<Precio precio={187493} precioOriginal={249990} descuento={25} />);
    expect(container.querySelector('.precio-original')).toHaveTextContent('$249.990');
    expect(container.querySelector('.precio-final')).toHaveTextContent('$187.493');
  });

  it('oculta el precio original cuando no hay descuento', () => {
    const { container } = render(<Precio precio={249990} precioOriginal={249990} descuento={0} />);
    expect(container.querySelector('.precio-original')).toBeNull();
  });
});