import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/atoms/Button';

describe('Button (atomo)', () => {
  it('renderiza el texto que recibe como children', () => {
    render(<Button>Comprar</Button>);
    expect(screen.getByRole('button', { name: 'Comprar' })).toBeInTheDocument();
  });

  it('usa type="button" por defecto para no enviar formularios por accidente', () => {
    render(<Button>Ok</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('aplica la clase CSS recibida por props', () => {
    render(<Button className="btn-red">Ok</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-red');
  });

  it('ejecuta onClick al hacer clic', () => {
    const onClick = jasmine.createSpy('onClick');
    render(<Button onClick={onClick}>Entrar</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
