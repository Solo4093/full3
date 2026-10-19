import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Button from '../components/atoms/Button';
import { useCart } from '../components/organisms/CartContext';
import { obtenerConsolas, precioFinal, descuentoDe } from '../data/consolas';

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregar } = useCart();
  const [aviso, setAviso] = useState('');
  const consola = obtenerConsolas().find((c) => c.id === parseInt(id));

  if (!consola) {
    return (
      <section id="content">
        <Container className="text-center text-white">
          <h2>Producto no encontrado</h2>
          <Button className="btn-outline" onClick={() => navigate('/productos')}>
            Volver a productos
          </Button>
        </Container>
      </section>
    );
  }

  const descuento = descuentoDe(consola);

  const handleAgregar = () => {
    const agregado = agregar(consola.id);
    setAviso(
      agregado
        ? 'Producto agregado al carrito.'
        : 'Ya tienes en el carrito todo el stock disponible.'
    );
  };

  return (
    <section id="content">
      <Container>
        <Row className="align-items-center g-4">
          <Col md={6}>
            <div className="img-box" style={{ height: 320 }}>
              {descuento > 0 && (
                <span className="badge bg-danger badge-oferta">-{descuento}%</span>
              )}
              <img className="img-obj" src={consola.imagen} alt={consola.nombre} />
            </div>
          </Col>
          <Col md={6} className="text-white">
            <h2>{consola.nombre}</h2>
            <p>Categoría: {consola.categoria}</p>
            <p>Stock disponible: {consola.stock}</p>
            <p className="precio">
              {descuento > 0 && (
                <span className="precio-original">
                  ${consola.precio.toLocaleString('es-CL')}
                </span>
              )}{' '}
              ${precioFinal(consola).toLocaleString('es-CL')}
            </p>

            <Button className="btn-red" onClick={handleAgregar} disabled={consola.stock === 0}>
              {consola.stock === 0 ? 'Sin stock' : 'Añadir al carrito'}
            </Button>{' '}
            <Button className="btn-outline" onClick={() => navigate(-1)}>
              Volver
            </Button>

            {aviso && <p className="exito-texto mt-3">{aviso}</p>}
          </Col>
        </Row>
      </Container>
    </section>
  );
}