import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import EstadoPedido from '../components/atoms/EstadoPedido';
import { obtenerPedidos } from '../data/pedidos';

export default function AdminOrdenes() {
  const [estado, setEstado] = useState('');

  const pedidos = obtenerPedidos()
    .filter((p) => estado === '' || p.estado === estado)
    .sort((a, b) => b.nro - a.nro);

  return (
    <>
      <div className="admin-titulo">
        <h2>Órdenes</h2>
        <select
          className="form-select select-estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pagado">Pagado</option>
          <option value="rechazado">Rechazado</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      {pedidos.length === 0 ? (
        <p>No hay órdenes para mostrar.</p>
      ) : (
        <Table variant="dark" striped responsive>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.nro}>
                <td>#{p.nro}</td>
                <td>{new Date(p.fecha).toLocaleString('es-CL')}</td>
                <td>{p.cliente.nombre} {p.cliente.apellidos}</td>
                <td>${p.total.toLocaleString('es-CL')}</td>
                <td><EstadoPedido estado={p.estado} /></td>
                <td>
                  <Link to={`/admin/ordenes/${p.nro}`} className="btn-outline admin-btn">
                    Mostrar boleta
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}