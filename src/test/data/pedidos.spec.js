import { agregarAlCarrito, detalleCarrito } from '../../data/carrito';
import { obtenerConsolas } from '../../data/consolas';
import {
  actualizarPedido,
  crearPedido,
  eliminarPedido,
  obtenerPedido,
  obtenerPedidos,
  pagarPedido,
  simularPago,
} from '../../data/pedidos';

const cliente = { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.cl' };
const entrega = { calle: 'Los Alerces 123', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Maipú', indicaciones: '' };

const nuevoPedido = () => {
  agregarAlCarrito(4, 2);
  return crearPedido({ cliente, entrega, items: detalleCarrito() });
};
const stockPS4 = () => obtenerConsolas().find((c) => c.id === 4).stock;

describe('data/pedidos (persistencia de pedidos y pago simulado)', () => {
  it('crea un pedido pendiente con numero correlativo y total calculado', () => {
    const primero = nuevoPedido();
    const segundo = nuevoPedido();
    expect(primero.estado).toBe('pendiente');
    expect(primero.total).toBe(374986);
    expect(segundo.nro).toBe(primero.nro + 1);
    expect(String(primero.nro)).toMatch(/^\d{8}$/);
    expect(obtenerPedidos().length).toBe(2);
  });

  it('no guarda la imagen en el pedido, pero la devuelve desde el catalogo', () => {
    const pedido = nuevoPedido();
    expect(obtenerPedidos()[0].items[0].imagen).toBeUndefined();
    expect(obtenerPedido(pedido.nro).items[0].imagen).toBeTruthy();
  });

  it('obtenerPedido devuelve null si el numero no existe', () => {
    expect(obtenerPedido(123)).toBeNull();
  });

  it('simularPago aprueba o rechaza según el numero aleatorio (mock)', () => {
    expect(simularPago(() => 0.9)).toBe(true);
    expect(simularPago(() => 0.1)).toBe(false);
  });

  it('pagarPedido aprobado marca el pedido como pagado y descuenta el stock', () => {
    const { nro } = nuevoPedido();
    const pagado = pagarPedido(nro, () => 0.9);
    expect(pagado.estado).toBe('pagado');
    expect(stockPS4()).toBe(10);
  });

  it('pagarPedido rechazado no descuenta stock y permite reintentar', () => {
    const { nro } = nuevoPedido();
    expect(pagarPedido(nro, () => 0.1).estado).toBe('rechazado');
    expect(stockPS4()).toBe(12);
    expect(pagarPedido(nro, () => 0.9).estado).toBe('pagado');
    expect(stockPS4()).toBe(10);
  });

  it('un pedido ya pagado no se cobra ni descuenta stock otra vez', () => {
    const { nro } = nuevoPedido();
    pagarPedido(nro, () => 0.9);
    const aleatorio = jasmine.createSpy('aleatorio').and.returnValue(0.9);
    pagarPedido(nro, aleatorio);
    expect(aleatorio).not.toHaveBeenCalled();
    expect(stockPS4()).toBe(10);
  });

  it('pagarPedido lanza un error si el pedido no existe', () => {
    expect(() => pagarPedido(999)).toThrowError('Pedido no encontrado');
  });

  it('actualiza y elimina pedidos', () => {
    const { nro } = nuevoPedido();
    expect(actualizarPedido(nro, { estado: 'pagado' }).estado).toBe('pagado');
    eliminarPedido(nro);
    expect(obtenerPedidos()).toEqual([]);
  });
});
