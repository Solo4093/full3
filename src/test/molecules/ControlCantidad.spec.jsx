import { render, screen, fireEvent } from '@testing-library/react';
import ControlCantidad from '../../components/molecules/ControlCantidad';

describe('ControlCantidad (molecula)', () => {
  it('muestra la cantidad recibida por props', () => {
    render(<ControlCantidad nombre="PSP" cantidad={3} max={5} onCambiar={() => {}} />);
    expect(screen.getByLabelText('Cantidad de PSP')).toHaveTextContent('3');
  });

  it('los botones − y + llaman a onCambiar con la nueva cantidad', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    render(<ControlCantidad nombre="PSP" cantidad={3} max={5} onCambiar={onCambiar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad de PSP' }));
    expect(onCambiar).toHaveBeenCalledWith(4);
    fireEvent.click(screen.getByRole('button', { name: 'Disminuir cantidad de PSP' }));
    expect(onCambiar).toHaveBeenCalledWith(2);
  });

  it('desactiva − en 1 y + al llegar al maximo (stock)', () => {
    const { rerender } = render(<ControlCantidad nombre="PSP" cantidad={1} max={5} onCambiar={() => {}} />);
    expect(screen.getByRole('button', { name: 'Disminuir cantidad de PSP' })).toBeDisabled();
    rerender(<ControlCantidad nombre="PSP" cantidad={5} max={5} onCambiar={() => {}} />);
    expect(screen.getByRole('button', { name: 'Aumentar cantidad de PSP' })).toBeDisabled();
  });
});
