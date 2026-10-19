import {
  actualizarCantidad,
  agregarAlCarrito,
  cantidadCarrito,
  detalleCarrito,
  eliminarDelCarrito,
  obtenerCarrito,
  totalCarrito,
  vaciarCarrito,
} from '../../data/carrito';

describe('data/carrito (persistencia CRUD del carrito)', () => {
  it('agrega un producto nuevo y suma la cantidad si se agrega otra vez', () => {
    expect(agregarAlCarrito(4)).toBe(true);
    agregarAlCarrito(4, 2);
    expect(obtenerCarrito()).toEqual([{ id: 4, cantidad: 3 }]);
  });

  it('no permite superar el stock disponible', () => {
    expect(agregarAlCarrito(7, 10)).toBe(true);
    expect(obtenerCarrito()[0].cantidad).toBe(5);
    expect(agregarAlCarrito(7)).toBe(false);
    expect(obtenerCarrito()[0].cantidad).toBe(5);
  });

  it('lanza un error si el producto no existe en el catalogo', () => {
    expect(() => agregarAlCarrito(999)).toThrowError('Producto no encontrado');
  });

  it('actualizarCantidad deja la cantidad entre 1 y el stock', () => {
    agregarAlCarrito(7);
    actualizarCantidad(7, 3);
    expect(obtenerCarrito()[0].cantidad).toBe(3);
    actualizarCantidad(7, 0);
    expect(obtenerCarrito()[0].cantidad).toBe(1);
    actualizarCantidad(7, 99);
    expect(obtenerCarrito()[0].cantidad).toBe(5);
  });

  it('elimina un producto y vacia el carrito', () => {
    agregarAlCarrito(4);
    agregarAlCarrito(7);
    eliminarDelCarrito(4);
    expect(obtenerCarrito().map((l) => l.id)).toEqual([7]);
    vaciarCarrito();
    expect(obtenerCarrito()).toEqual([]);
  });

  it('detalleCarrito une cada linea con el catalogo y calcula el subtotal', () => {
    agregarAlCarrito(4, 2);
    const [linea] = detalleCarrito();
    expect(linea.nombre).toBe('Playstation 4');
    expect(linea.precio).toBe(187493);
    expect(linea.subtotal).toBe(374986);
    expect(linea.stock).toBe(12);
  });

  it('detalleCarrito ignora productos que ya no existen en el catalogo', () => {
    localStorage.setItem('carrito', JSON.stringify([{ id: 999, cantidad: 1 }, { id: 4, cantidad: 1 }]));
    expect(detalleCarrito().map((l) => l.id)).toEqual([4]);
  });

  it('totalCarrito y cantidadCarrito suman todas las lineas', () => {
    agregarAlCarrito(4, 2);
    agregarAlCarrito(7);
    const items = detalleCarrito();
    expect(totalCarrito(items)).toBe(187493 * 2 + 51994);
    expect(cantidadCarrito(items)).toBe(3);
    expect(totalCarrito([])).toBe(0);
  });

  it('si el carrito guardado está corrupto, se trata como vacio', () => {
    localStorage.setItem('carrito', '{no es json');
    expect(obtenerCarrito()).toEqual([]);
    localStorage.setItem('carrito', '"texto"');
    expect(obtenerCarrito()).toEqual([]);
  });
});
