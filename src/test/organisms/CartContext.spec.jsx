import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../../components/organisms/CartContext';

function Consumidor() {
  const { items, total, cantidad, agregar, cambiarCantidad, quitar, vaciar } = useCart();
  return (
    <>
      <p data-testid="total">{total}</p>
      <p data-testid="cantidad">{cantidad}</p>
      <p data-testid="lineas">{items.length}</p>
      <button onClick={() => agregar(4)}>agregar ps4</button>
      <button onClick={() => agregar(7, 10)}>agregar psp</button>
      <button onClick={() => cambiarCantidad(4, 3)}>cambiar ps4</button>
      <button onClick={() => quitar(4)}>quitar ps4</button>
      <button onClick={vaciar}>vaciar</button>
    </>
  );
}

const renderConsumidor = () => render(<CartProvider><Consumidor /></CartProvider>);
const texto = (id) => screen.getByTestId(id).textContent;

describe('CartContext (organismo)', () => {
  it('parte vacio cuando no hay nada guardado', () => {
    renderConsumidor();
    expect(texto('total')).toBe('0');
    expect(texto('cantidad')).toBe('0');
  });

  it('carga el carrito guardado en localStorage al iniciar', () => {
    localStorage.setItem('carrito', JSON.stringify([{ id: 4, cantidad: 2 }]));
    renderConsumidor();
    expect(texto('cantidad')).toBe('2');
    expect(texto('total')).toBe('374986');
  });

  it('agregar actualiza la interfaz y guarda en localStorage', () => {
    renderConsumidor();
    fireEvent.click(screen.getByText('agregar ps4'));
    expect(texto('cantidad')).toBe('1');
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([{ id: 4, cantidad: 1 }]);
  });

  it('agregar devuelve false al llegar al stock', () => {
    renderConsumidor();
    fireEvent.click(screen.getByText('agregar psp')); // pide 10, stock 5
    expect(texto('cantidad')).toBe('5');
  });

  it('cambiarCantidad, quitar y vaciar modifican el carrito', () => {
    renderConsumidor();
    fireEvent.click(screen.getByText('agregar ps4'));
    fireEvent.click(screen.getByText('cambiar ps4'));
    expect(texto('cantidad')).toBe('3');
    fireEvent.click(screen.getByText('quitar ps4'));
    expect(texto('lineas')).toBe('0');
    fireEvent.click(screen.getByText('agregar ps4'));
    fireEvent.click(screen.getByText('vaciar'));
    expect(texto('lineas')).toBe('0');
    expect(localStorage.getItem('carrito')).toBeNull();
  });
});
