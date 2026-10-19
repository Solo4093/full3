import { Link, useNavigate } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import Button from '../components/atoms/Button';
import TablaCarrito from '../components/organisms/TablaCarrito';
import { useCart } from '../components/organisms/CartContext';

export default function Carrito() {
  const { items, total, cambiarCantidad, quitar, vaciar } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section id="content">
        <Container className="text-center">
          <h2 className="section-title">Carrito de compras</h2>
          <p className="texto-auth mb-3">Tu carrito está vacío.</p>
          <Link to="/productos" className="btn-outline enlace-boton">Ver productos</Link>
        </Container>
      </section>
    );
  }

  return (
    <section id="content">
      <Container>
        <Card className="auth-card p-4">
          <h2 className="section-title">Carrito de compras</h2>

          <TablaCarrito items={items} onCambiarCantidad={cambiarCantidad} onEliminar={quitar} />

          <p className="total-carrito">Total: ${total}</p>

          <div className="acciones-carrito">
            <Button className="btn-outline" onClick={vaciar}>Limpiar carrito</Button>
            <Button className="btn-red" onClick={() => navigate('/checkout')}>Comprar ahora</Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}
