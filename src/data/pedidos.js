import { actualizarConsola, obtenerConsolas } from './consolas';

const CLAVE = 'pedidos';

export const PROBABILIDAD_RECHAZO = 0.25;

function guardar(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

function conImagenes(pedido) {
  const catalogo = obtenerConsolas();
  return {
    ...pedido,
    items: pedido.items.map((item) => ({
      ...item,
      imagen: catalogo.find((c) => c.id === item.id)?.imagen,
    })),
  };
}

export function obtenerPedidos() {
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function obtenerPedido(nro) {
  const pedido = obtenerPedidos().find((p) => p.nro === Number(nro));
  return pedido ? conImagenes(pedido) : null;
}

export function crearPedido({ cliente, entrega, items }) {
  const lista = obtenerPedidos();
  const base = Number(`${new Date().getFullYear()}0000`);
  const nro = Math.max(base, ...lista.map((p) => p.nro)) + 1;
  const lineas = items.map(({ id, nombre, precio, cantidad, subtotal }) => ({
    id, nombre, precio, cantidad, subtotal,
  }));
  const pedido = {
    nro,
    fecha: new Date().toISOString(),
    estado: 'pendiente',
    cliente,
    entrega,
    items: lineas,
    total: lineas.reduce((suma, i) => suma + i.subtotal, 0),
  };
  guardar([...lista, pedido]);
  return conImagenes(pedido);
}

export function actualizarPedido(nro, cambios) {
  guardar(obtenerPedidos().map((p) => (p.nro === Number(nro) ? { ...p, ...cambios } : p)));
  return obtenerPedido(nro);
}

export function eliminarPedido(nro) {
  guardar(obtenerPedidos().filter((p) => p.nro !== Number(nro)));
}

export function simularPago(aleatorio = Math.random) {
  return aleatorio() >= PROBABILIDAD_RECHAZO;
}

export function pagarPedido(nro, aleatorio = Math.random) {
  const pedido = obtenerPedido(nro);
  if (!pedido) throw new Error('Pedido no encontrado');
  if (pedido.estado === 'pagado') return pedido;

  const aprobado = simularPago(aleatorio);
  if (aprobado) {
    const catalogo = obtenerConsolas();
    pedido.items.forEach(({ id, cantidad }) => {
      const consola = catalogo.find((c) => c.id === id);
      if (consola) actualizarConsola(id, { stock: Math.max(0, consola.stock - cantidad) });
    });
  }
  return actualizarPedido(nro, { estado: aprobado ? 'pagado' : 'rechazado' });
}
