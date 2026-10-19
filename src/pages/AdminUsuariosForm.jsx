import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import CampoFormulario from '../components/molecules/CampoFormulario';
import { obtenerUsuarios, crearUsuario, actualizarUsuario } from '../data/usuarios';

const vacio = { nombre: '', apellidos: '', correo: '', rol: 'cliente', password: '' };

export default function AdminUsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existente = id ? obtenerUsuarios().find((u) => u.id === parseInt(id)) : null;

  // En edición la contraseña parte vacía: si se deja así, no se cambia
  const [datos, setDatos] = useState(existente ? { ...existente, password: '' } : vacio);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');

  if (id && !existente) {
    return <h2>Usuario no encontrado</h2>;
  }

  const cambiar = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  const validar = () => {
    const nuevos = {};
    if (datos.nombre.trim().length < 2) nuevos.nombre = 'Ingresa el nombre';
    if (datos.apellidos.trim().length < 2) nuevos.apellidos = 'Ingresa los apellidos';
    if (!datos.correo.includes('@')) nuevos.correo = 'Ingresa un correo válido';
    if (!existente && datos.password.length < 6) {
      nuevos.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (existente && datos.password !== '' && datos.password.length < 6) {
      nuevos.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    return nuevos;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorGeneral('');
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    try {
      if (existente) {
        const cambios = {
          nombre: datos.nombre.trim(),
          apellidos: datos.apellidos.trim(),
          correo: datos.correo,
          rol: datos.rol,
        };
        if (datos.password !== '') cambios.password = datos.password;
        actualizarUsuario(existente.id, cambios);
      } else {
        crearUsuario({
          nombre: datos.nombre,
          apellidos: datos.apellidos,
          correo: datos.correo,
          rol: datos.rol,
          password: datos.password,
        });
      }
      navigate('/admin/usuarios');
    } catch (err) {
      setErrorGeneral(err.message);
    }
  };

  return (
    <>
      <h2>{existente ? 'Editar usuario' : 'Nuevo usuario'}</h2>

      <form className="form-admin" onSubmit={handleSubmit} noValidate>
        <CampoFormulario
          id="usr-nombre" label="Nombre" value={datos.nombre}
          onChange={cambiar('nombre')} error={errores.nombre}
        />
        <CampoFormulario
          id="usr-apellidos" label="Apellidos" value={datos.apellidos}
          onChange={cambiar('apellidos')} error={errores.apellidos}
        />
        <CampoFormulario
          id="usr-correo" label="Correo" type="email" value={datos.correo}
          onChange={cambiar('correo')} error={errores.correo}
        />
        <CampoFormulario
          id="usr-password"
          label={existente ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          type="password" value={datos.password}
          onChange={cambiar('password')} error={errores.password}
        />

        <label>Rol</label>
        <select className="form-select" value={datos.rol} onChange={cambiar('rol')}>
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>

        {errorGeneral && <p className="error-texto" role="alert">{errorGeneral}</p>}

        <div>
          <Button type="submit" className="btn-red admin-btn">Guardar</Button>{' '}
          <Button className="btn-outline admin-btn" onClick={() => navigate('/admin/usuarios')}>
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
}