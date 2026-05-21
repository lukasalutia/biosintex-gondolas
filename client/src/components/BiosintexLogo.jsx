/**
 * variant="full"  → logo horizontal completo (login)
 * variant="header" → isologo en barra (cabe en móvil sin recortar)
 */
export default function BiosintexLogo({ className = '', variant = 'full', height }) {
  const isHeader = variant === 'header';
  const src = isHeader ? '/biosintex-isologo.png?v=2' : '/biosintex-logo.png?v=2';
  const h = height ?? (isHeader ? 34 : 52);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-visible ${isHeader ? '' : 'w-full'} ${className}`}
    >
      <img
        src={src}
        alt="Biosintex — Siempre en tu farmacia"
        className="block object-contain object-center max-w-full"
        style={{ height: h, width: 'auto' }}
        draggable={false}
      />
    </div>
  );
}
