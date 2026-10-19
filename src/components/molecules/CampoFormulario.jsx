import { Form } from 'react-bootstrap';
import { Input } from '../atoms/Input';

// Molécula: etiqueta + input + mensaje de error.
// Recibe todo por props (no tiene estado propio): el padre controla el valor.
export function CampoFormulario({ id, label, error, ...inputProps }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label className="etiqueta-auth">{label}</Form.Label>
      <Input isInvalid={Boolean(error)} {...inputProps} />
      {error && (
        <p className="error-texto mt-1" role="alert">
          {error}
        </p>
      )}
    </Form.Group>
  );
}

export default CampoFormulario;
