import { Link } from 'react-router-dom';
import { obtenerConsolas } from '../data/consolas';
import { obtenerUsuarios } from '../data/usuarios';
import { obtenerPedidos } from '../data/pedidos';

const STOCK_CRITICO = 5;

export default function AdminDashboard() {
  const consolas = obtenerConsolas();
  const usuarios = obtenerUsuarios();
  const pagados = obtenerPedidos().filter((p) => p.estado === 'pagado');
  const ventas = pagados.reduce((suma, p) => suma + p.total, 0);
  const enOferta = consolas.filter((c) => c.oferta).length;
  const criticos = consolas.filter((c) => c.stock <= STOCK_CRITICO);

  return (
    <>
      <h2>Dashboard</h2>

      <div className="admin-stats">
        <div className="stat-card">
          <span>Productos</span>
          <strong>{consolas.length}</strong>
        </div>
        <div className="stat-card">
          <span>En oferta</span>
          <strong>{enOferta}</strong>
        </div>
        <div className="stat-card">
          <span>Stock crítico</span>
          <strong>{criticos.length}</strong>
        </div>
        <div className="stat-card">
          <span>Usuarios</span>
          <strong>{usuarios.length}</strong>
        </div>
        <div className="stat-card">
          <span>Compras pagadas</span>
          <strong>{pagados.length}</strong>
        </div>
        <div className="stat-card">
          <span>Ventas</span>
          <strong>${ventas.toLocaleString('es-CL')}</strong>
        </div>
      </div>

      <h3>Productos con stock crítico ({STOCK_CRITICO} o menos)</h3>
      {criticos.length === 0 ? (
        <p>No hay productos con stock crítico.</p>
      ) : (
        <ul>
          {criticos.map((c) => (
            <li key={c.id}>
              {c.nombre}: {c.stock} unidades.{' '}
              <Link to={`/admin/productos/${c.id}/editar`}>Editar</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}