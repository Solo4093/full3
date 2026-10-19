import {
  obtenerConsolas,
  crearConsola,
  actualizarConsola,
  eliminarConsola,
  descuentoDe,
  precioFinal,
  DESCUENTO_OFERTA,
} from '../../data/consolas';

describe('data/consolas (CRUD sobre localStorage)', () => {
  it('Read: carga las 8 consolas iniciales y las guarda en localStorage', () => {
    const setItem = spyOn(Storage.prototype, 'setItem').and.callThrough();
    const lista = obtenerConsolas();
    expect(lista.length).toBe(8);
    expect(setItem).toHaveBeenCalledWith('consolas', jasmine.any(String));
  });

  it('Create: agrega una consola con el siguiente id y la persiste', () => {
    const nueva = crearConsola({ nombre: 'Steam Deck', precio: 400000, categoria: 'Valve', oferta: false, stock: 3 });
    expect(nueva.id).toBe(9);
    expect(obtenerConsolas().length).toBe(9);
    expect(obtenerConsolas().some((c) => c.nombre === 'Steam Deck')).toBeTrue();
  });

  it('Update: cambia solo los campos indicados de la consola indicada', () => {
    const antes = obtenerConsolas().find((c) => c.id === 2);
    actualizarConsola(1, { stock: 99 });
    const lista = obtenerConsolas();
    expect(lista.find((c) => c.id === 1).stock).toBe(99);
    expect(lista.find((c) => c.id === 2)).toEqual(antes);
  });

  it('Delete: elimina la consola por id', () => {
    eliminarConsola(1);
    const lista = obtenerConsolas();
    expect(lista.length).toBe(7);
    expect(lista.some((c) => c.id === 1)).toBeFalse();
  });

  it('vuelve a cargar los datos iniciales si la version guardada es antigua', () => {
    localStorage.setItem('consolas', JSON.stringify([]));
    localStorage.setItem('consolas_version', '1');
    expect(obtenerConsolas().length).toBe(8);
  });

  it('descuentoDe: 0 sin oferta, el descuento propio con oferta y el de respaldo si falta', () => {
    expect(descuentoDe({ oferta: false, descuento: 10 })).toBe(0);
    expect(descuentoDe({ oferta: true, descuento: 25 })).toBe(25);
    expect(descuentoDe({ oferta: true })).toBe(DESCUENTO_OFERTA);
  });

  it('precioFinal: aplica el descuento y redondea al entero', () => {
    expect(precioFinal({ precio: 100000, oferta: true, descuento: 25 })).toBe(75000);
    expect(precioFinal({ precio: 100000, oferta: false })).toBe(100000);
    expect(precioFinal({ precio: 79990, oferta: true, descuento: 35 })).toBe(51994);
  });
});
