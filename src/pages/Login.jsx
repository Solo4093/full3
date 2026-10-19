import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Button from '../components/atoms/Button';
import CampoFormulario from '../components/molecules/CampoFormulario';
import { useAuth } from "../components/organisms/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  const validar = () => {
    const nuevos = {};
    if (!correo.includes('@')) nuevos.correo = 'Ingresa un correo válido';
    if (password.length === 0) nuevos.password = 'Ingresa tu contraseña';
    return nuevos;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorGeneral('');
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    try {
      login({ correo, password });
      navigate('/');
    } catch (err) {
      setErrorGeneral(err.message);
    }
  };

  return (
    <section id="content">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5}>
            <Card className="auth-card p-4">
              <h2 className="section-title">Iniciar sesión</h2>

              <form onSubmit={handleSubmit} noValidate>
                <CampoFormulario
                  id="login-correo"
                  label="Correo"
                  type="email"
                  placeholder="tucorreo@ejemplo.cl"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  error={errores.correo}
                />

                <CampoFormulario
                  id="login-password"
                  label="Contraseña"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errores.password}
                />

                {errorGeneral && (
                  <p className="error-texto" role="alert">{errorGeneral}</p>
                )}

                <Button type="submit" className="btn-red">Entrar</Button>
              </form>

              <p className="texto-auth mt-3 mb-0">
                ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
