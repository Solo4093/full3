import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Input } from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import {
  obtenerCategorias,
  crearCategoria,
  renombrarCategoria,
  eliminarCategoria,
} from '../data/categorias';

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState(obtenerCategorias);
  const [nueva, setNueva] = useState('');
  const [error, setError] = useState('');

  // Patrón: ejecutar la operación, y si sale bien, recargar la lista
  const ejecutar = (accion) => {
    try {
      accion();
      setError('');
      setCategorias(obtenerCategorias());
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCrear = (e) => {
    e.preventDefault();
    ejecutar(() => {
      crearCategoria(nueva);
      setNueva('');
    });
  };

  const handleRenombrar = (nombre) => {
    const nuevo = window.prompt('Nuevo nombre de la categoría:', nombre);
    if (nuevo !== null) ejecutar(() => renombrarCategoria(nombre, nuevo));
  };

  const handleEliminar = (nombre) => {
    if (window.confirm(`¿Eliminar la categoría "${nombre}"?`)) {
      ejecutar(() => eliminarCategoria(nombre));
    }
  };

  return (
    <>
      <h2>Categorías</h2>

      <form className="form-admin form-inline-admin" onSubmit={handleCrear}>
        <Input
          placeholder="Nueva categoría"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />
        <Button type="submit" className="btn-red admin-btn">Agregar</Button>
      </form>

      {error && <p className="error-texto">{error}</p>}

      <Table variant="dark" striped responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((nombre) => (
            <tr key={nombre}>
              <td>{nombre}</td>
              <td>
                <button className="btn-outline admin-btn" onClick={() => handleRenombrar(nombre)}>
                  Renombrar
                </button>{' '}
                <button className="admin-btn-eliminar" onClick={() => handleEliminar(nombre)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}