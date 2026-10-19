import { screen, fireEvent } from '@testing-library/react';
import Ofertas from '../../pages/Ofertas';
import { actualizarConsola, obtenerConsolas } from '../../data/consolas';
import { renderConProviders } from '../helpers';

const nombresMostrados = () =>
  screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

describe('Ofertas (página)', () => {
  it('muestra solo las consolas en oferta y su cantidad', () => {
    renderConProviders(<Ofertas />);
    expect(screen.getByText('5 productos en oferta')).toBeInTheDocument();
    expect(nombresMostrados()).not.toContain('Playstation 5');
    expect(nombresMostrados().length).toBe(5);
  });

  it('por defecto ordena por mayor descuento', () => {
    renderConProviders(<Ofertas />);
    expect(nombresMostrados()[0]).toBe('PSP');
  });

  it('cambiar el orden a "Mayor precio" reordena las tarjetas (evento + estado)', () => {
    renderConProviders(<Ofertas />);
    fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'mayor' } });
    expect(nombresMostrados()[0]).toBe('Nintendo switch 1');
  });

  it('si ninguna consola está en oferta muestra un mensaje', () => {
    obtenerConsolas().filter((c) => c.oferta).forEach((c) => actualizarConsola(c.id, { oferta: false }));
    renderConProviders(<Ofertas />);
    expect(screen.getByText('Por ahora no hay productos en oferta.')).toBeInTheDocument();
  });
});
