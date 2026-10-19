const COLORES = { pagado: 'success', rechazado: 'danger', pendiente: 'warning' };

export default function EstadoPedido({ estado }) {
  return <span className={`badge bg-${COLORES[estado] ?? 'secondary'}`}>{estado}</span>;
}