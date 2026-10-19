import { Table } from 'react-bootstrap';
import { obtenerPedidos } from '../data/pedidos';

const pesos = (n) => `$${n.toLocaleString('es-CL')}`;

export default function AdminReportes() {
  const pedidos = obtenerPedidos();
  const pagados = pedidos.filter((p) => p.estado === 'pagado');
  const rechazados = pedidos.filter((p) => p.estado === 'rechazado').length;
  const ventas = pagados.reduce((suma, p) => suma + p.total, 0);
  const promedio = pagados.length > 0 ? Math.round(ventas / pagados.length) : 0;

  const acumulado = {};
  pagados.forEach((p) =>
    p.items.forEach((i) => {
      const previo = acumulado[i.nombre] ?? { unidades: 0, monto: 0 };
      acumulado[i.nombre] = {
        unidades: previo.unidades + i.cantidad,
        monto: previo.monto + i.subtotal,
      };
    })
  );

  const ranking = Object.entries(acumulado)
    .map(([nombre, datos]) => ({ nombre, ...datos }))
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 5);

  return (
    <>
      <h2>Reportes</h2>

      <div className="admin-stats">
        <div className="stat-card">
          <span>Ventas totales</span>
          <strong>{pesos(ventas)}</strong>
        </div>
        <div className="stat-card">
          <span>Compras pagadas</span>
          <strong>{pagados.length}</strong>
        </div>
        <div className="stat-card">
          <span>Pagos rechazados</span>
          <strong>{rechazados}</strong>
        </div>
        <div className="stat-card">
          <span>Compra promedio</span>
          <strong>{pesos(promedio)}</strong>
        </div>
      </div>

      <h3>Productos más vendidos</h3>
      {ranking.length === 0 ? (
        <p>Todavía no hay ventas pagadas.</p>
      ) : (
        <Table variant="dark" striped responsive>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Unidades</th>
              <th>Monto vendido</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r) => (
              <tr key={r.nombre}>
                <td>{r.nombre}</td>
                <td>{r.unidades}</td>
                <td>{pesos(r.monto)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}