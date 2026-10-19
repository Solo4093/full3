import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import blogs from '../data/Blogs';

export default function DetalleBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find((b) => b.id === parseInt(id));

  if (!blog) {
    return (
      <section id="content">
        <div className="pagina-texto">
          <h2 className="section-title">Entrada no encontrada</h2>
          <Button className="btn-outline" onClick={() => navigate('/blog')}>
            Volver al blog
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="content">
      <div className="pagina-texto">
        <h2 className="section-title">{blog.titulo}</h2>
        <small>{blog.fecha}</small>
        <p>{blog.contenido}</p>
        <Button className="btn-outline" onClick={() => navigate('/blog')}>
          Volver al blog
        </Button>
      </div>
    </section>
  );
}