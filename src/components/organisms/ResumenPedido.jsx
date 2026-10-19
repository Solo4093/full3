import { Col, Form, Row } from 'react-bootstrap';
import TablaProductos from './TablaProductos';

const CampoLectura = ({ label, valor }) => (
  <Form.Group className="mb-3">
    <Form.Label className="etiqueta-auth">{label}</Form.Label>
    <Form.Control readOnly value={valor || ''} />
  </Form.Group>
);

export default function ResumenPedido({ pedido, etiquetaTotal = 'Total pagado' }) {
  const { cliente, entrega, items, total } = pedido;
  return (
    <>
      <Row>
        <Col md={4}><CampoLectura label="Nombre" valor={cliente.nombre} /></Col>
        <Col md={4}><CampoLectura label="Apellido" valor={cliente.apellidos} /></Col>
        <Col md={4}><CampoLectura label="Correo" valor={cliente.correo} /></Col>
      </Row>

      <h3 className="subtitulo-pedido">Dirección de entrega de los productos</h3>
      <Row>
        <Col md={6}><CampoLectura label="Calle" valor={entrega.calle} /></Col>
        <Col md={6}><CampoLectura label="Departamento (opcional)" valor={entrega.departamento} /></Col>
        <Col md={6}><CampoLectura label="Región" valor={entrega.region} /></Col>
        <Col md={6}><CampoLectura label="Comuna" valor={entrega.comuna} /></Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label className="etiqueta-auth">Indicaciones para la entrega (opcional)</Form.Label>
        <Form.Control as="textarea" rows={2} readOnly value={entrega.indicaciones || ''} />
      </Form.Group>

      <TablaProductos items={items} />

      <p className="total-pagado">{etiquetaTotal}: ${total}</p>
    </>
  );
}
