import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../components/organisms/AuthContext';
import { usuariosIniciales } from '../../data/usuarios';

const [admin] = usuariosIniciales;

function Consumidor({ correo = admin.correo, password = admin.password }) {
  const { user, login, logout, register } = useAuth();
  const [error, setError] = useState('');
  const intentar = (accion) => {
    try {
      accion();
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <div>
      <p data-testid="usuario">{user ? user.nombre : 'anonimo'}</p>
      <p data-testid="error">{error}</p>
      <button onClick={() => intentar(() => login({ correo, password }))}>entrar</button>
      <button onClick={logout}>salir</button>
      <button
        onClick={() =>
          intentar(() => register({ nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@mail.cl', password: '123456' }))
        }
      >
        registrar
      </button>
    </div>
  );
}

const renderAuth = (props) =>
  render(
    <AuthProvider>
      <Consumidor {...props} />
    </AuthProvider>
  );

describe('AuthContext (organismo)', () => {
  it('parte sin sesión', () => {
    renderAuth();
    expect(screen.getByTestId('usuario')).toHaveTextContent('anonimo');
  });

  it('login correcto actualiza el estado y guarda la sesion sin la contraseña', () => {
    renderAuth();
    fireEvent.click(screen.getByText('entrar'));
    expect(screen.getByTestId('usuario')).toHaveTextContent(admin.nombre);
    const sesion = JSON.parse(localStorage.getItem('sesion'));
    expect(sesion.correo).toBe(admin.correo);
    expect(sesion.password).toBeUndefined();
  });

  it('login incorrecto lanza error y no abre sesion', () => {
    renderAuth({ password: 'mala' });
    fireEvent.click(screen.getByText('entrar'));
    expect(screen.getByTestId('error')).toHaveTextContent('Correo o contraseña incorrectos');
    expect(screen.getByTestId('usuario')).toHaveTextContent('anonimo');
    expect(localStorage.getItem('sesion')).toBeNull();
  });

  it('logout borra la sesion del estado y del localStorage', () => {
    renderAuth();
    fireEvent.click(screen.getByText('entrar'));
    fireEvent.click(screen.getByText('salir'));
    expect(screen.getByTestId('usuario')).toHaveTextContent('anonimo');
    expect(localStorage.getItem('sesion')).toBeNull();
  });

  it('restaura la sesion guardada al cargar la pagina', () => {
    localStorage.setItem('sesion', JSON.stringify({ id: 2, nombre: 'Cliente', correo: 'cliente@nexus.cl' }));
    renderAuth();
    expect(screen.getByTestId('usuario')).toHaveTextContent('Cliente');
  });

  it('register crea el usuario y abre sesion automaticamente', () => {
    renderAuth();
    fireEvent.click(screen.getByText('registrar'));
    expect(screen.getByTestId('usuario')).toHaveTextContent('Ana');
  });
});
