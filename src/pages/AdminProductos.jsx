import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import {
  obtenerConsolas,
  eliminarConsola,
  descuentoDe,
  precioFinal,
} from '../data/consolas';

const STOCK_CRITICO = 5;

export default function AdminProductos() {
  const [consolas, setConsolas] = useState(obtenerConsolas);

  const handleEliminar = (consola) => {
    if (window.confirm(`¿Eliminar "${consola.nombre}"?`)) {
      eliminarConsola(consola.id);
      setConsolas(obtenerConsolas());
    }
  };

  return (
    <>
      <div className="admin-titulo">
        <h2>Productos</h2>
        <Link to="/admin/productos/nuevo" className="btn-primary-sm admin-btn">
          Nuevo producto
        </Link>
      </div>

      <Table variant="dark" striped responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Oferta</th>
            <th>Precio final</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {consolas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.categoria}</td>
              <td>${c.precio.toLocaleString('es-CL')}</td>
              <td>{descuentoDe(c) > 0 ? `-${descuentoDe(c)}%` : 'No'}</td>
              <td>${precioFinal(c).toLocaleString('es-CL')}</td>
              <td className={c.stock <= STOCK_CRITICO ? 'stock-critico' : ''}>{c.stock}</td>
              <td>
                <Link to={`/admin/productos/${c.id}/editar`} className="btn-outline admin-btn">
                  Editar
                </Link>{' '}
                <button className="admin-btn-eliminar" onClick={() => handleEliminar(c)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}