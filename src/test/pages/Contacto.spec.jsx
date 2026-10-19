import { render, screen, fireEvent } from '@testing-library/react';
import Contacto from '../../pages/Contacto';

const enviar = () => fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

describe('Contacto (página)', () => {
  it('al inicio no muestra errores ni confirmación', () => {
    render(<Contacto />);
    expect(screen.queryByText(/El nombre debe tener/)).toBeNull();
    expect(screen.queryByText(/Mensaje enviado/)).toBeNull();
  });

  it('con datos inválidos muestra los tres errores y no confirma el envío', () => {
    render(<Contacto />);
    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Al' } });
    fireEvent.change(screen.getByPlaceholderText('Tu mensaje'), { target: { value: 'corto' } });
    enviar();
    expect(screen.getByText('El nombre debe tener al menos 3 caracteres')).toBeInTheDocument();
    expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres')).toBeInTheDocument();
    expect(screen.queryByText(/Mensaje enviado/)).toBeNull();
  });

  it('con datos válidos confirma el envío y limpia el formulario (estado)', () => {
    render(<Contacto />);
    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByPlaceholderText('Tu correo'), { target: { value: 'ana@mail.cl' } });
    fireEvent.change(screen.getByPlaceholderText('Tu mensaje'), { target: { value: 'Hola, quiero consultar por stock' } });
    enviar();
    expect(screen.getByText('¡Mensaje enviado! Te responderemos pronto.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu nombre')).toHaveValue('');
    expect(screen.getByPlaceholderText('Tu mensaje')).toHaveValue('');
  });
});
