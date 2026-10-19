import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardConsola from '../components/molecules/CardConsola';
import { useCart } from '../components/organisms/CartContext';
import { obtenerConsolas, precioFinal, descuentoDe } from '../data/consolas';

export default function Home() {
  const [consolas] = useState(obtenerConsolas);
  const navigate = useNavigate();
  const { agregar } = useCart();

  return (
    <section id="content">
      <article className="inicio">
        <h2>Bienvenido a Nexus Gaming</h2>
        <p>
          Encuentra y compra las mejores consolas para tus videojuegos favoritos.
          Tenemos Playstation, Xbox y Nintendo.
        </p>
      </article>

      <article className="section-container">
        <h2 className="section-title">Consolas destacadas</h2>
        <p className="section-title">
          En Nexus Gaming puedes encontrar muchas consolas de videojuegos.
          Mira el resto del catálogo en la sección Productos.
        </p>

        <div className="contenedor">
          {consolas.slice(0, 3).map((item) => (
            <CardConsola
              key={item.id}
              nombre={item.nombre}
              imagen={item.imagen}
              precio={precioFinal(item)}
              precioOriginal={item.precio}
              descuento={descuentoDe(item)}
              onVerDetalle={() => navigate(`/productos/${item.id}`)}
              onAgregar={() => {
                if (!agregar(item.id)) {
                  alert('Ya tienes todo el stock disponible en el carrito.');
                }
              }}
            />
          ))}
        </div>
      </article>
    </section>
  );
}