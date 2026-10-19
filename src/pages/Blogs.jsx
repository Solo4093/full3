import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import blogs from '../data/Blogs';

export default function Blog() {
  const navigate = useNavigate();

  return (
    <section id="content">
      <div className="section-container">
        <h2 className="section-title">Blog</h2>

        <div className="contenedor">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <h3>{blog.titulo}</h3>
              <small>{blog.fecha}</small>
              <p>{blog.resumen}</p>
              <Button className="btn-outline" onClick={() => navigate(`/blog/${blog.id}`)}>
                Leer más
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}