import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import { useAuth } from './AuthContext';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const salir = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Nexus Admin</h3>
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/productos">Productos</NavLink>
        <NavLink to="/admin/categorias">Categorías</NavLink>
        <NavLink to="/admin/usuarios">Usuarios</NavLink>
        <NavLink to="/admin/ordenes">Órdenes</NavLink>
        <NavLink to="/admin/reportes">Reportes</NavLink>
        <Link to="/">Ver tienda</Link>
        <Button className="btn-outline" onClick={salir}>Cerrar sesión</Button>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}