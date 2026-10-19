import { render, screen } from '@testing-library/react';
import AdminReportes from '../../pages/AdminReportes';

describe('AdminReportes', () => {
  it('avisa cuando todavía no hay ventas', () => {
    render(<AdminReportes />);
    expect(screen.getByText('Todavía no hay ventas pagadas.')).toBeTruthy();
  });

  it('muestra el producto vendido en el ranking si hay una compra pagada', () => {
    localStorage.setItem(
      'pedidos',
      JSON.stringify([
        {
          nro: 20260001,
          fecha: new Date().toISOString(),
          estado: 'pagado',
          cliente: { nombre: 'Ana', apellidos: 'Test', correo: 'ana@test.cl' },
          entrega: {},
          items: [
            { id: 1, nombre: 'Playstation 5', precio: 1000, cantidad: 2, subtotal: 2000 },
          ],
          total: 2000,
        },
      ])
    );

    render(<AdminReportes />);

    expect(screen.getByText('Playstation 5')).toBeTruthy();
    expect(screen.queryByText('Todavía no hay ventas pagadas.')).toBeNull();
  });

  it('muestra las tarjetas de resumen', () => {
    render(<AdminReportes />);
    expect(screen.getByText('Ventas totales')).toBeTruthy();
    expect(screen.getByText('Compras pagadas')).toBeTruthy();
    expect(screen.getByText('Pagos rechazados')).toBeTruthy();
  });
});