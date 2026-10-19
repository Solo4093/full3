import { Link, useParams } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import Button from '../components/atoms/Button';
import EstadoPedido from '../components/atoms/EstadoPedido';
import { obtenerPedido } from '../data/pedidos';

export default function AdminBoleta() {
  const { nro } = useParams();
  const pedido = obtenerPedido(nro);

  if (!pedido) {
    return (
      <>
        <h2>Orden no encontrada</h2>
        <Link to="/admin/ordenes" className="btn-outline admin-btn">Volver a órdenes</Link>
      </>
    );
  }

  const { cliente, entrega } = pedido;

  return (
    <>
      <h2>Boleta #{pedido.nro} <EstadoPedido estado={pedido.estado} /></h2>
      <p>Fecha: {new Date(pedido.fecha).toLocaleString('es-CL')}</p>

      <h3>Cliente</h3>
      <p>{cliente.nombre} {cliente.apellidos} ({cliente.correo})</p>

      <h3>Entrega</h3>
      <p>
        {entrega.calle}
        {entrega.departamento && `, depto ${entrega.departamento}`}, {entrega.comuna}, {entrega.region}
      </p>
      {entrega.indicaciones && <p>Indicaciones: {entrega.indicaciones}</p>}

      <Table variant="dark" striped responsive>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((i) => (
            <tr key={i.id}>
              <td>{i.nombre}</td>
              <td>${i.precio.toLocaleString('es-CL')}</td>
              <td>{i.cantidad}</td>
              <td>${i.subtotal.toLocaleString('es-CL')}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3"><strong>Total</strong></td>
            <td><strong>${pedido.total.toLocaleString('es-CL')}</strong></td>
          </tr>
        </tfoot>
      </Table>

      <div className="no-imprimir">
        <Button className="btn-red admin-btn" onClick={() => window.print()}>
          Imprimir boleta
        </Button>{' '}
        <Link to="/admin/ordenes" className="btn-outline admin-btn">Volver a órdenes</Link>
      </div>
    </>
  );
}