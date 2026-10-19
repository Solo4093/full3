import { render, screen } from '@testing-library/react';
import Nosotros from '../../pages/Nosotros';

describe('Nosotros (página)', () => {
  it('presenta la tienda y las marcas con las que trabaja', () => {
    render(<Nosotros />);
    expect(screen.getByRole('heading', { name: 'Nosotros' })).toBeInTheDocument();
    expect(screen.getByText(/Sony, Microsoft/)).toBeInTheDocument();
  });
});
