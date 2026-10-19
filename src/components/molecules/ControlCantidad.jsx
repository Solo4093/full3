import Button from '../atoms/Button';

export default function ControlCantidad({ nombre, cantidad, max, onCambiar }) {
  return (
    <div className="control-cantidad">
      <Button
        className="btn-outline"
        aria-label={`Disminuir cantidad de ${nombre}`}
        disabled={cantidad <= 1}
        onClick={() => onCambiar(cantidad - 1)}
      >
        −
      </Button>
      <span className="cantidad-valor" aria-label={`Cantidad de ${nombre}`}>{cantidad}</span>
      <Button
        className="btn-outline"
        aria-label={`Aumentar cantidad de ${nombre}`}
        disabled={cantidad >= max}
        onClick={() => onCambiar(cantidad + 1)}
      >
        +
      </Button>
    </div>
  );
}
