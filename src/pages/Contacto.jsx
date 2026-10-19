import { useState } from 'react';
import { Input } from '../components/atoms/Input';
import Button from '../components/atoms/Button';

export default function Contacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const validar = () => {
    const nuevos = {};
    if (nombre.trim().length < 3) nuevos.nombre = 'El nombre debe tener al menos 3 caracteres';
    if (!correo.includes('@')) nuevos.correo = 'Ingresa un correo válido';
    if (mensaje.trim().length < 10) nuevos.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    return nuevos;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);

    if (Object.keys(nuevos).length === 0) {
      setEnviado(true);
      setNombre('');
      setCorreo('');
      setMensaje('');
    } else {
      setEnviado(false);
    }
  };

  return (
    <section id="content">
      <h2 className="section-title">Contacto</h2>

      <form className="form-contacto" onSubmit={handleSubmit}>
        <Input
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        {errores.nombre && <p className="error-texto">{errores.nombre}</p>}

        <Input
          type="email"
          placeholder="Tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        {errores.correo && <p className="error-texto">{errores.correo}</p>}

        <Input
          type="textarea"
          rows={4}
          placeholder="Tu mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
        {errores.mensaje && <p className="error-texto">{errores.mensaje}</p>}

        <Button type="submit" className="btn-red">Enviar mensaje</Button>

        {enviado && <p className="exito-texto">¡Mensaje enviado! Te responderemos pronto.</p>}
      </form>
    </section>
  );
}