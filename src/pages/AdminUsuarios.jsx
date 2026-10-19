import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { obtenerUsuarios, eliminarUsuario } from '../data/usuarios';
import { useAuth } from '../components/organisms/AuthContext';

export default function AdminUsuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState(obtenerUsuarios);

  const handleEliminar = (u) => {
    if (window.confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}?`)) {
      eliminarUsuario(u.id);
      setUsuarios(obtenerUsuarios());
    }
  };

  return (
    <>
      <div className="admin-titulo">
        <h2>Usuarios</h2>
        <Link to="/admin/usuarios/nuevo" className="btn-primary-sm admin-btn">
          Nuevo usuario
        </Link>
      </div>

      <Table variant="dark" striped responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre} {u.apellidos}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>
                <Link to={`/admin/usuarios/${u.id}/editar`} className="btn-outline admin-btn">
                  Editar
                </Link>{' '}
                <Link to={`/admin/usuarios/${u.id}/historial`} className="btn-outline admin-btn">
                    Historial
                </Link>{' '}
                {u.id !== user.id && (
                  <button className="admin-btn-eliminar" onClick={() => handleEliminar(u)}>
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}