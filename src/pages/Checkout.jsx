import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';
import Button from '../components/atoms/Button';
import CampoFormulario from '../components/molecules/CampoFormulario';
import CampoSelect from '../components/molecules/CampoSelect';
import TablaProductos from '../components/organisms/TablaProductos';
import { useAuth } from '../components/organisms/AuthContext';
import { useCart } from '../components/organisms/CartContext';
import { REGIONES } from '../data/regiones';
import { crearPedido, pagarPedido } from '../data/pedidos';

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, vaciar } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: user?.nombre ?? '',
    apellidos: user?.apellidos ?? '',
    correo: user?.correo ?? '',
    calle: '',
    departamento: '',
    region: '',
    comuna: '',
    indicaciones: '',
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegion = (e) => setForm({ ...form, region: e.target.value, comuna: '' });

  const validar = () => {
    const nuevos = {};
    if (form.nombre.trim().length < 2) nuevos.nombre = 'Ingresa tu nombre';
    if (form.apellidos.trim().length < 2) nuevos.apellidos = 'Ingresa tus apellidos';
    if (!REGEX_CORREO.test(form.correo)) nuevos.correo = 'Ingresa un correo válido';
    if (form.calle.trim().length < 3) nuevos.calle = 'Ingresa la calle y el número';
    if (!form.region) nuevos.region = 'Debes seleccionar una región';
    if (!form.comuna) nuevos.comuna = 'Debes seleccionar una comuna';
    return nuevos;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const pedido = crearPedido({
      cliente: {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim(),
      },
      entrega: {
        calle: form.calle.trim(),
        departamento: form.departamento.trim(),
        region: form.region,
        comuna: form.comuna,
        indicaciones: form.indicaciones.trim(),
      },
      items,
    });

    const { estado } = pagarPedido(pedido.nro);
    if (estado === 'pagado') {
      vaciar();
      navigate(`/compra-exitosa/${pedido.nro}`);
    } else {
      navigate(`/compra-fallida/${pedido.nro}`);
    }
  };

  if (items.length === 0) {
    return (
      <section id="content">
        <Container className="text-center">
          <h2 className="section-title">Checkout</h2>
          <p className="texto-auth mb-3">No tienes productos en el carrito.</p>
          <Link to="/productos" className="btn-outline enlace-boton">Ver productos</Link>
        </Container>
      </section>
    );
  }

  return (
    <section id="content">
      <Container>
        <Card className="auth-card p-4">
          <div className="cabecera-checkout">
            <div>
              <h2 className="titulo-checkout">Carrito de compra</h2>
              <p className="texto-auth text-start">Completa la siguiente información</p>
            </div>
            <span className="badge bg-primary total-badge">Total a pagar: ${total}</span>
          </div>
          <TablaProductos items={items} />
          <form onSubmit={handleSubmit} noValidate>
            <h3 className="subtitulo-pedido">Información del cliente</h3>
            <Row>
              <Col md={6}>
                <CampoFormulario id="checkout-nombre" label="Nombre" name="nombre"
                  value={form.nombre} onChange={handleChange} error={errores.nombre} />
              </Col>
              <Col md={6}>
                <CampoFormulario id="checkout-apellidos" label="Apellidos" name="apellidos"
                  value={form.apellidos} onChange={handleChange} error={errores.apellidos} />
              </Col>
              <Col md={12}>
                <CampoFormulario id="checkout-correo" label="Correo" name="correo" type="email"
                  value={form.correo} onChange={handleChange} error={errores.correo} />
              </Col>
            </Row>
            <h3 className="subtitulo-pedido">Dirección de entrega de los productos</h3>
            <Row>
              <Col md={6}>
                <CampoFormulario id="checkout-calle" label="Calle" name="calle"
                  placeholder="Ej: Los Alerces 123" value={form.calle}
                  onChange={handleChange} error={errores.calle} />
              </Col>
              <Col md={6}>
                <CampoFormulario id="checkout-departamento" label="Departamento (opcional)"
                  name="departamento" placeholder="Ej: 603" value={form.departamento}
                  onChange={handleChange} />
              </Col>
              <Col md={6}>
                <CampoSelect id="checkout-region" label="Región" name="region"
                  placeholder="Selecciona una región" opciones={Object.keys(REGIONES)}
                  value={form.region} onChange={handleRegion} error={errores.region} />
              </Col>
              <Col md={6}>
                <CampoSelect id="checkout-comuna" label="Comuna" name="comuna"
                  placeholder="Selecciona una comuna" opciones={REGIONES[form.region] ?? []}
                  value={form.comuna} onChange={handleChange} error={errores.comuna} />
              </Col>
            </Row>
            <Form.Group className="mb-4" controlId="checkout-indicaciones">
              <Form.Label className="etiqueta-auth">Indicaciones para la entrega (opcional)</Form.Label>
              <Form.Control as="textarea" rows={3} name="indicaciones"
                placeholder="Ej: Entre calles, color de la casa, no hay timbre"
                value={form.indicaciones} onChange={handleChange} />
            </Form.Group>
            <div className="acciones-carrito">
              <Button type="submit" className="btn-red btn-pagar">
                Pagar ahora ${total}
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </section>
  );
}
