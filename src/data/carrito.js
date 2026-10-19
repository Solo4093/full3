import { obtenerConsolas, precioFinal } from './consolas';

const CLAVE = 'carrito';

function leer() {
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

export function obtenerCarrito() {
  return leer();
}

export function agregarAlCarrito(id, cantidad = 1) {
  const consola = obtenerConsolas().find((c) => c.id === id);
  if (!consola) throw new Error('Producto no encontrado');

  const lista = leer();
  const existente = lista.find((linea) => linea.id === id);
  const actual = existente ? existente.cantidad : 0;
  const nueva = Math.min(actual + cantidad, consola.stock);
  if (nueva <= actual) return false;

  guardar(
    existente
      ? lista.map((linea) => (linea.id === id ? { ...linea, cantidad: nueva } : linea))
      : [...lista, { id, cantidad: nueva }]
  );
  return true;
}

export function actualizarCantidad(id, cantidad) {
  const consola = obtenerConsolas().find((c) => c.id === id);
  const maximo = consola ? consola.stock : 1;
  const valida = Math.min(Math.max(Math.trunc(cantidad) || 1, 1), maximo);
  guardar(leer().map((linea) => (linea.id === id ? { ...linea, cantidad: valida } : linea)));
}

export function eliminarDelCarrito(id) {
  guardar(leer().filter((linea) => linea.id !== id));
}

export function vaciarCarrito() {
  localStorage.removeItem(CLAVE);
}

export function detalleCarrito() {
  const catalogo = obtenerConsolas();
  return leer()
    .map(({ id, cantidad }) => {
      const consola = catalogo.find((c) => c.id === id);
      if (!consola) return null;
      const precio = precioFinal(consola);
      return {
        id,
        nombre: consola.nombre,
        imagen: consola.imagen,
        stock: consola.stock,
        precio,
        cantidad,
        subtotal: precio * cantidad,
      };
    })
    .filter(Boolean);
}

export const totalCarrito = (items) => items.reduce((suma, i) => suma + i.subtotal, 0);
export const cantidadCarrito = (items) => items.reduce((suma, i) => suma + i.cantidad, 0);
