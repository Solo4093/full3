import { Link, useParams } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import EstadoPedido from '../components/atoms/EstadoPedido';
import { obtenerUsuarios } from '../data/usuarios';
import { obtenerPedidos } from '../data/pedidos';

export default function AdminUsuarioHistorial() {
  const { id } = useParams();
  const usuario = obtenerUsuarios().find((u) => u.id === parseInt(id));

  if (!usuario) {
    return <h2>Usuario no encontrado</h2>;
  }

  const pedidos = obtenerPedidos()
    .filter((p) => p.cliente.correo.toLowerCase() === usuario.correo.toLowerCase())
    .sort((a, b) => b.nro - a.nro);

  const gastado = pedidos
    .filter((p) => p.estado === 'pagado')
    .reduce((suma, p) => suma + p.total, 0);

  return (
    <>
      <h2>Historial de {usuario.nombre} {usuario.apellidos}</h2>
      <p>
        {usuario.correo} | Total pagado: <strong>${gastado.toLocaleString('es-CL')}</strong>
      </p>

      {pedidos.length === 0 ? (
        <p>Este usuario todavía no tiene compras.</p>
      ) : (
        <Table variant="dark" striped responsive>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Boleta</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.nro}>
                <td>#{p.nro}</td>
                <td>{new Date(p.fecha).toLocaleString('es-CL')}</td>
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

      <Link to="/admin/usuarios" className="btn-outline admin-btn">Volver a usuarios</Link>
    </>
  );
}