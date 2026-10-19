const formato = (valor) => `$${valor.toLocaleString('es-CL')}`;

export default function Precio({ precio, precioOriginal, descuento = 0, className = '' }) {
  const enOferta = descuento > 0 && precioOriginal !== undefined;

  return (
    <p className={`precio ${className}`.trim()}>
      {enOferta && (
        <>
          <span className="precio-original">{formato(precioOriginal)}</span>
          <br />
        </>
      )}
      <span className="precio-final">{formato(precio)}</span>
    </p>
  );
}
