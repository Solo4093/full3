import { Form } from 'react-bootstrap';

export default function CampoSelect({ id, label, error, placeholder, opciones, ...selectProps }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label className="etiqueta-auth">{label}</Form.Label>
      <Form.Select isInvalid={Boolean(error)} {...selectProps}>
        <option value="">{placeholder}</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>{opcion}</option>
        ))}
      </Form.Select>
      {error && (
        <p className="error-texto mt-1" role="alert">{error}</p>
      )}
    </Form.Group>
  );
}
