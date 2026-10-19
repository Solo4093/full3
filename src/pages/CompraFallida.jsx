import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import Button from '../components/atoms/Button';
import ResumenPedido from '../components/organisms/ResumenPedido';
import { useCart } from '../components/organisms/CartContext';
import { obtenerPedido, pagarPedido } from '../data/pedidos';

export default function CompraFallida() {
  const { nro } = useParams();
  const navigate = useNavigate();
  const { vaciar } = useCart();
  const [pedido, setPedido] = useState(() => obtenerPedido(nro));
  const [reintentado, setReintentado] = useState(false);

  if (!pedido || pedido.estado === 'pagado') {
    return (
      <section id="content">
        <Container className="text-center">
          <h2 className="section-title">Pedido no encontrado</h2>
          <Link to="/carrito" className="btn-outline enlace-boton">Volver al carrito</Link>
        </Container>
      </section>
    );
  }

  const handleReintentar = () => {
    const actualizado = pagarPedido(pedido.nro);
    if (actualizado.estado === 'pagado') {
      vaciar();
      navigate(`/compra-exitosa/${pedido.nro}`);
      return;
    }
    setPedido(actualizado);
    setReintentado(true);
  };

  return (
    <section id="content">
      <Container>
        <Card className="auth-card p-4">
          <h2 className="titulo-checkout titulo-error">
             No se pudo realizar el pago. nro #{pedido.nro}
          </h2>
          <p className="texto-auth text-start mb-3">Detalle de compra</p>
          {reintentado && (
            <p className="error-texto mb-3" role="alert">
              El pago fue rechazado nuevamente. Intentalo otra vez.
            </p>
          )}
          <div className="acciones-carrito mb-3">
            <Button className="btn-pagar btn-reintentar" onClick={handleReintentar}>
              Volver a realizar el pago
            </Button>
          </div>
          <ResumenPedido pedido={pedido} etiquetaTotal="Total a pagar" />
        </Card>
      </Container>
    </section>
  );
}
