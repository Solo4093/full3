import { Link, useParams } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import Button from '../components/atoms/Button';
import ResumenPedido from '../components/organisms/ResumenPedido';
import { obtenerPedido } from '../data/pedidos';

export default function CompraExitosa() {
  const { nro } = useParams();
  const pedido = obtenerPedido(nro);

  if (!pedido || pedido.estado !== 'pagado') {
    return (
      <section id="content">
        <Container className="text-center">
          <h2 className="section-title">Compra no encontrada</h2>
          <Link to="/productos" className="btn-outline enlace-boton">Ir a productos</Link>
        </Container>
      </section>
    );
  }

  return (
    <section id="content">
      <Container>
        <Card className="auth-card p-4">
          <p className="codigo-orden">Código orden: {pedido.nro}</p>
          <h2 className="titulo-checkout titulo-exito">
            ✔ Se ha realizado la compra. nro #{pedido.nro}
          </h2>
          <p className="texto-auth text-start mb-3">Completa la siguiente información</p>
          <ResumenPedido pedido={pedido} />
          <div className="acciones-carrito">
            <Button className="btn-outline">Imprimir boleta</Button>
            <Link to="/productos" className="btn-red enlace-boton">Seguir comprando</Link>
          </div>
        </Card>
      </Container>
    </section>
  );
}
