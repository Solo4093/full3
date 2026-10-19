import Button from '../atoms/Button';
import Precio from '../atoms/Precio';

export default function CardConsola({
  nombre,
  imagen,
  precio,
  precioOriginal,
  descuento = 0,
  onVerDetalle,
  onAgregar,
}) {
  return (
    <div className="caluga">
      <h3>{nombre}</h3>
      <div className="img-box">
        {descuento > 0 && <span className="badge bg-danger badge-oferta">-{descuento}%</span>}
        <img className="img-obj" src={imagen} alt={nombre} />
      </div>
      <Precio precio={precio} precioOriginal={precioOriginal} descuento={descuento} />
      {onVerDetalle && (
        <Button className="btn-outline btn-detalle" onClick={onVerDetalle}>
          Ver detalles
        </Button>
      )}
      <Button className="btn-red" onClick={onAgregar}>Comprar</Button>
    </div>
  );
}
