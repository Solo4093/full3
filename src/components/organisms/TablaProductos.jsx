import { Table } from 'react-bootstrap';

export default function TablaProductos({ items }) {
  return (
    <Table responsive variant="dark" size="sm" className="align-middle tabla-carrito">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>
              {item.imagen && <img className="img-carrito" src={item.imagen} alt={item.nombre} />}
            </td>
            <td>{item.nombre}</td>
            <td>${item.precio}</td>
            <td>{item.cantidad}</td>
            <td>${item.subtotal}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
