import { Link, useParams, useNavigate } from 'react-router-dom';
import CardConsola from '../components/molecules/CardConsola';
import { useCart } from '../components/organisms/CartContext';
import { obtenerConsolas, precioFinal, descuentoDe } from '../data/consolas';

export default function Categorias() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const { agregar } = useCart();
  const consolas = obtenerConsolas();

  // Lista de categorías sin repetir
  const categorias = [...new Set(consolas.map((c) => c.categoria))];

  // Si hay una categoría en la URL se filtra; si no, se muestran todas
  const filtradas = categoria
    ? consolas.filter((c) => c.categoria === categoria)
    : consolas;

  return (
    <section id="content">
      <div className="section-container">
        <h2 className="section-title">Categorías</h2>

        <div className="contenedor categorias-lista">
          {categorias.map((cat) => (
            <Link
              key={cat}
              to={`/categorias/${encodeURIComponent(cat)}`}
              className={`categoria-chip ${cat === categoria ? 'activa' : ''}`}
            >
              {cat}
            </Link>
          ))}
        </div>

        <h3 className="section-title">{categoria ? categoria : 'Todas las consolas'}</h3>

        {filtradas.length === 0 ? (
          <p className="section-title">No hay consolas en esta categoría.</p>
        ) : (
          <div className="contenedor">
            {filtradas.map((item) => (
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
        )}
      </div>
    </section>
  );
}