import { createContext, useContext, useState } from 'react';
import {
  actualizarCantidad,
  agregarAlCarrito,
  cantidadCarrito,
  detalleCarrito,
  eliminarDelCarrito,
  totalCarrito,
  vaciarCarrito,
} from '../../data/carrito';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(detalleCarrito);
  const refrescar = () => setItems(detalleCarrito());

  const agregar = (id, cantidad = 1) => {
    const cambio = agregarAlCarrito(id, cantidad);
    refrescar();
    return cambio;
  };

  const cambiarCantidad = (id, cantidad) => {
    actualizarCantidad(id, cantidad);
    refrescar();
  };

  const quitar = (id) => {
    eliminarDelCarrito(id);
    refrescar();
  };

  const vaciar = () => {
    vaciarCarrito();
    refrescar();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total: totalCarrito(items),
        cantidad: cantidadCarrito(items),
        agregar,
        cambiarCantidad,
        quitar,
        vaciar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);