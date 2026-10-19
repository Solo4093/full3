import { render, screen } from '@testing-library/react';
import EstadoPedido from '../../components/atoms/EstadoPedido';

describe('EstadoPedido', () => {
  it('muestra el estado recibido por props', () => {
    render(<EstadoPedido estado="pagado" />);
    expect(screen.getByText('pagado')).toBeTruthy();
  });

  it('usa verde para pagado', () => {
    render(<EstadoPedido estado="pagado" />);
    expect(screen.getByText('pagado')).toHaveClass('bg-success');
  });

  it('usa rojo para rechazado', () => {
    render(<EstadoPedido estado="rechazado" />);
    expect(screen.getByText('rechazado')).toHaveClass('bg-danger');
  });

  it('usa gris si el estado es desconocido', () => {
    render(<EstadoPedido estado="otro" />);
    expect(screen.getByText('otro')).toHaveClass('bg-secondary');
  });
});