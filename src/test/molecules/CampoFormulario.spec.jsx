import { render, screen, fireEvent } from '@testing-library/react';
import CampoFormulario from '../../components/molecules/CampoFormulario';

describe('CampoFormulario (molecula)', () => {
  it('asocia la etiqueta con su input', () => {
    render(<CampoFormulario id="correo" label="Correo" />);
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
  });

  it('no muestra mensaje de error si no hay error', () => {
    render(<CampoFormulario id="correo" label="Correo" />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('muestra el error y marca el input como invalido cuando recibe error', () => {
    render(<CampoFormulario id="correo" label="Correo" error="Ingresa un correo valido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Ingresa un correo valido');
    expect(screen.getByLabelText('Correo')).toHaveClass('is-invalid');
  });

  it('propaga onChange al input cuando el usuario escribe', () => {
    const onChange = jasmine.createSpy('onChange');
    render(<CampoFormulario id="nombre" label="Nombre" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
