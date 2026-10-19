import { render, screen, fireEvent } from '@testing-library/react';
import CampoSelect from '../../components/molecules/CampoSelect';

const props = {
  id: 'region',
  label: 'Región',
  placeholder: 'Selecciona una región',
  opciones: ['Norte', 'Sur'],
};

describe('CampoSelect (molecula)', () => {
  it('muestra la etiqueta, el texto inicial y las opciones', () => {
    render(<CampoSelect {...props} value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Región')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Selecciona una región' })).toBeInTheDocument();
    expect(screen.getAllByRole('option').length).toBe(3);
  });

  it('muestra el mensaje de error solo cuando hay error', () => {
    const { rerender } = render(<CampoSelect {...props} value="" onChange={() => {}} />);
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(<CampoSelect {...props} value="" onChange={() => {}} error="Selecciona una región" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona una región');
  });

  it('ejecuta onChange al elegir una opción', () => {
    const onChange = jasmine.createSpy('onChange');
    render(<CampoSelect {...props} value="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Región'), { target: { value: 'Sur' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});