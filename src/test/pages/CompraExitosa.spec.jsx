import { screen, fireEvent } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import CompraExitosa from '../../pages/CompraExitosa';
import { crearPedido, pagarPedido } from '../../data/pedidos';
import { agregarAlCarrito, detalleCarrito } from '../../data/carrito';
import { renderConProviders } from '../helpers';

const rutas = (
  <Routes>
    <Route path="/compra-exitosa/:nro" element={<CompraExitosa />} />
    <Route path="/productos" element={<p>Pantalla productos</p>} />
  </Routes>
);

const pedidoPagado = () => {
  agregarAlCarrito(4, 2);
  const { nro } = crearPedido({
    cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@correo.cl' },
    entrega: { calle: 'Los Alerces 123', departamento: '603', region: 'Región Metropolitana de Santiago', comuna: 'Maipú', indicaciones: 'Tocar el timbre' },
    items: detalleCarrito(),
  });
  pagarPedido(nro, () => 0.9);
  return nro;
};

describe('CompraExitosa (página)', () => {
  it('muestra el número de compra, los datos de entrega y el total pagado', () => {
    const nro = pedidoPagado();
    renderConProviders(rutas, `/compra-exitosa/${nro}`);
    expect(screen.getByRole('heading', { name: new RegExp(`Se ha realizado la compra. nro #${nro}`) })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ana')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Maipú')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tocar el timbre')).toBeInTheDocument();
    expect(screen.getByText('Playstation 4')).toBeInTheDocument();
    expect(screen.getByText('Total pagado: $374986')).toBeInTheDocument();
  });

  it('con un número inexistente muestra "Compra no encontrada"', () => {
    renderConProviders(rutas, '/compra-exitosa/1');
    expect(screen.getByText('Compra no encontrada')).toBeInTheDocument();
  });

  it('un pedido sin pagar no se muestra como compra exitosa', () => {
    agregarAlCarrito(4);
    const { nro } = crearPedido({ cliente: {}, entrega: {}, items: detalleCarrito() });
    renderConProviders(rutas, `/compra-exitosa/${nro}`);
    expect(screen.getByText('Compra no encontrada')).toBeInTheDocument();
  });

  it('"Imprimir boleta" se muestra pero no hace nada al presionarlo', () => {
    const imprimir = spyOn(window, 'print');
    const nro = pedidoPagado();
    renderConProviders(rutas, `/compra-exitosa/${nro}`);
    const boton = screen.getByRole('button', { name: 'Imprimir boleta' });
    expect(boton).toBeInTheDocument();
    fireEvent.click(boton);
    expect(imprimir).not.toHaveBeenCalled();
  });
});
