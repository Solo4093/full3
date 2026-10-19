import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Button from '../components/atoms/Button';
import CampoFormulario from '../components/molecules/CampoFormulario';
import { useAuth } from "../components/organisms/AuthContext";

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    confirmar: '',
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    const nuevos = {};
    if (form.nombre.trim().length < 3) nuevos.nombre = 'El nombre debe tener al menos 3 caracteres';
    if (form.apellidos.trim().length < 2) nuevos.apellidos = 'Ingresa tus apellidos';
    if (!REGEX_CORREO.test(form.correo)) nuevos.correo = 'Ingresa un correo válido';
    if (form.password.length < 6) nuevos.password = 'La contraseña debe tener al menos 6 caracteres';
    if (form.confirmar !== form.password) nuevos.confirmar = 'Las contraseñas no coinciden';
    return nuevos;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorGeneral('');
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    try {
      register(form);
      navigate('/');
    } catch (err) {
      setErrorGeneral(err.message);
    }
  };

  return (
    <section id="content">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={7}>
            <Card className="auth-card p-4">
              <h2 className="section-title">Crear cuenta</h2>

              <form onSubmit={handleSubmit} noValidate>
                <Row>
                  <Col xs={12} md={6}>
                    <CampoFormulario
                      id="reg-nombre"
                      label="Nombre"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      error={errores.nombre}
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <CampoFormulario
                      id="reg-apellidos"
                      label="Apellidos"
                      name="apellidos"
                      value={form.apellidos}
                      onChange={handleChange}
                      error={errores.apellidos}
                    />
                  </Col>
                </Row>

                <CampoFormulario
                  id="reg-correo"
                  label="Correo"
                  type="email"
                  name="correo"
                  placeholder="tucorreo@ejemplo.cl"
                  value={form.correo}
                  onChange={handleChange}
                  error={errores.correo}
                />

                <Row>
                  <Col xs={12} md={6}>
                    <CampoFormulario
                      id="reg-password"
                      label="Contraseña"
                      type="password"
                      name="password"
                      placeholder="Mínimo 6 caracteres"
                      value={form.password}
                      onChange={handleChange}
                      error={errores.password}
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <CampoFormulario
                      id="reg-confirmar"
                      label="Repetir contraseña"
                      type="password"
                      name="confirmar"
                      value={form.confirmar}
                      onChange={handleChange}
                      error={errores.confirmar}
                    />
                  </Col>
                </Row>

                {errorGeneral && (
                  <p className="error-texto" role="alert">{errorGeneral}</p>
                )}

                <Button type="submit" className="btn-red">Crear cuenta</Button>
              </form>

              <p className="texto-auth mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
