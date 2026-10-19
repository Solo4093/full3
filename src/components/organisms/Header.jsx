import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { useAuth } from './AuthContext';
import logoImg from '../../assets/logo.png';

export const Header = ({ onBuscar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBuscar = (event) => {
    event.preventDefault();
    onBuscar(texto);
    navigate('/productos');
  };

  return (
    <header className="top-header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <img src={logoImg} alt="Logo Nexus Gaming" className="logo-header" />
        </Link>

        <form className="search-container" onSubmit={handleBuscar}>
          <Input
            placeholder="Buscar..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <Button type="submit" className="btn-outline">Buscar</Button>
        </form>

        <div className="user-actions">
          {user ? (
            <>
              <span className="user-saludo">Hola, {user.nombre}</span>
              {user.rol === 'admin' && (
                <Button className="btn-primary-sm" onClick={() => navigate('/admin')}>
                  Panel admin
                </Button>
              )}
              <Button className="btn-outline" onClick={handleLogout}>Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Button className="btn-outline" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </Button>
              <Button className="btn-primary-sm" onClick={() => navigate('/registro')}>
                Crear Cuenta
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};