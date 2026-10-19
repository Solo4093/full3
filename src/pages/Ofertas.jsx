import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Form, Row } from 'react-bootstrap';
import CardConsola from '../components/molecules/CardConsola';
import { descuentoDe, obtenerConsolas, precioFinal } from '../data/consolas';

const ORDENES = {
  descuento: { texto: 'Mayor descuento', comparar: (a, b) => descuentoDe(b) - descuentoDe(a) },
  menor: { texto: 'Menor precio', comparar: (a, b) => precioFinal(a) - precioFinal(b) },
  mayor: { texto: 'Mayor precio', comparar: (a, b) => precioFinal(b) - precioFinal(a) },
};

export default function Ofertas() {
  const navigate = useNavigate();
  const [orden, setOrden] = useState('descuento');

  const ofertas = obtenerConsolas()
    .filter((c) => c.oferta)
    .sort(ORDENES[orden].comparar);

  return (
    <section id="content">
      <Container>
        <h2 className="section-title">Ofertas</h2>

        {ofertas.length === 0 ? (
          <p className="section-title">Por ahora no hay productos en oferta.</p>
        ) : (
          <>
            <Row className="align-items-end mb-4 g-2">
              <Col xs={12} md={8}>
                <p className="texto-auth text-md-start mb-0">
                  {ofertas.length} {ofertas.length === 1 ? 'producto' : 'productos'} en oferta
                </p>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group controlId="orden-ofertas">
                  <Form.Label className="etiqueta-auth">Ordenar por</Form.Label>
                  <Form.Select value={orden} onChange={(e) => setOrden(e.target.value)}>
                    {Object.entries(ORDENES).map(([clave, { texto }]) => (
                      <option key={clave} value={clave}>{texto}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-4 justify-content-center">
              {ofertas.map((item) => (
                <Col key={item.id} xs={12} sm={6} lg={4} xl={3} className="d-flex justify-content-center">
                  <CardConsola
                    nombre={item.nombre}
                    imagen={item.imagen}
                    precio={precioFinal(item)}
                    precioOriginal={item.precio}
                    descuento={descuentoDe(item)}
                    onVerDetalle={() => navigate(`/productos/${item.id}`)}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </section>
  );
}
