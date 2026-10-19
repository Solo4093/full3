import { Table } from 'react-bootstrap';
import Button from '../atoms/Button';
import ControlCantidad from '../molecules/ControlCantidad';

export default function TablaCarrito({ items, onCambiarCantidad, onEliminar }) {
  return (
    <Table responsive variant="dark" className="align-middle tabla-carrito">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td><img className="img-carrito" src={item.imagen} alt={item.nombre} /></td>
            <td>{item.nombre}</td>
            <td>${item.precio}</td>
            <td>
              <ControlCantidad
                nombre={item.nombre}
                cantidad={item.cantidad}
                max={item.stock}
                onCambiar={(cantidad) => onCambiarCantidad(item.id, cantidad)}
              />
            </td>
            <td>${item.subtotal}</td>
            <td>
              <Button
                className="btn-red btn-eliminar"
                aria-label={`Eliminar ${item.nombre}`}
                onClick={() => onEliminar(item.id)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
