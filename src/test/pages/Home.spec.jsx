import { screen } from '@testing-library/react';
import Home from '../../pages/Home';
import { renderConProviders } from '../helpers';

describe('Home (página)', () => {
  it('muestra la bienvenida y solo las 3 primeras consolas', () => {
    const { container } = renderConProviders(<Home />);
    expect(screen.getByText('Bienvenido a Nexus Gaming')).toBeInTheDocument();
    expect(container.querySelectorAll('.caluga').length).toBe(3);
  });
});
