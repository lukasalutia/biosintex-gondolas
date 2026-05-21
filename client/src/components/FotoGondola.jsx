const ISOLOGO_HEIGHT = { xs: 12, sm: 20, md: 28, lg: 36 };

/** Foto de góndola con marca de agua del isologo Biosintex (tubos de ensayo). */
export default function FotoGondola({
  src,
  alt = '',
  className = '',
  imgClassName = 'w-full h-full object-cover',
  size = 'sm',
}) {
  const isoHeight = ISOLOGO_HEIGHT[size] ?? ISOLOGO_HEIGHT.sm;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className={imgClassName} />
      <img
        src="/biosintex-isologo.png?v=2"
        alt=""
        aria-hidden="true"
        className="absolute bottom-1 right-1 pointer-events-none drop-shadow-md"
        style={{ height: isoHeight, width: 'auto' }}
      />
    </div>
  );
}
