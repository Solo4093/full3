import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import CompraFallida from '../../pages/CompraFallida';
import { crearPedido, obtenerPedido, pagarPedido } from '../../data/pedidos';
import { agregarAlCarrito, detalleCarrito } from '../../data/carrito';
import { renderConProviders } from '../helpers';

const rutas = (
  <Routes>
    <Route path="/compra-fallida/:nro" element={<CompraFallida />} />
    <Route path="/compra-exitosa/:nro" element={<p>Pantalla compra exitosa</p>} />
    <Route path="/carrito" element={<p>Pantalla carrito</p>} />
  </Routes>
);

const pedidoRechazado = () => {
  agregarAlCarrito(4, 2);
  const { nro } = crearPedido({
    cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.cl' },
    entrega: { calle: 'Los Alerces 123', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Maipú', indicaciones: '' },
    items: detalleCarrito(),
  });
  pagarPedido(nro, () => 0.1);
  return nro;
};

describe('CompraFallida (página)', () => {
  it('muestra que el pago falló, el detalle y el botón para reintentar', () => {
    const nro = pedidoRechazado();
    renderConProviders(rutas, `/compra-fallida/${nro}`);
    expect(screen.getByRole('heading', { name: new RegExp(`No se pudo realizar el pago. nro #${nro}`) })).toBeInTheDocument();
    expect(screen.getByText('Total a pagar: $374986')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver a realizar el pago' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('si el reintento vuelve a fallar, avisa y se queda en la página', () => {
    spyOn(Math, 'random').and.returnValue(0.1);
    const nro = pedidoRechazado();
    renderConProviders(rutas, `/compra-fallida/${nro}`);
    fireEvent.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }));
    expect(screen.getByRole('alert')).toHaveTextContent('rechazado nuevamente');
    expect(obtenerPedido(nro).estado).toBe('rechazado');
  });

  it('si el reintento se aprueba, vacía el carrito y va a compra exitosa', () => {
    spyOn(Math, 'random').and.returnValue(0.9);
    const nro = pedidoRechazado();
    renderConProviders(rutas, `/compra-fallida/${nro}`);
    fireEvent.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }));
    expect(screen.getByText('Pantalla compra exitosa')).toBeInTheDocument();
    expect(obtenerPedido(nro).estado).toBe('pagado');
    expect(localStorage.getItem('carrito')).toBeNull();
  });

  it('con un número inexistente muestra "Pedido no encontrado"', () => {
    renderConProviders(rutas, '/compra-fallida/1');
    expect(screen.getByText('Pedido no encontrado')).toBeInTheDocument();
  });
});
