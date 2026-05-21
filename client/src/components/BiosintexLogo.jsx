/**
 * variant="full"  → logo horizontal completo (login)
 * variant="header" → isologo en barra (cabe en móvil sin recortar)
 */
export default function BiosintexLogo({ className = '', variant = 'full', height }) {
  const isHeader = variant === 'header';
  const src = isHeader ? '/biosintex-isologo.png?v=3' : '/biosintex-logo.png?v=2';
  const h = height ?? (isHeader ? 36 : 52);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-visible ${isHeader ? 'pr-1' : 'w-full'} ${className}`}
    >
      <img
        src={src}
        alt="Biosintex — Siempre en tu farmacia"
        className={`block object-contain object-left ${isHeader ? '' : 'max-w-full mx-auto'}`}
        style={{ height: h, width: 'auto', maxWidth: isHeader ? 'none' : '100%' }}
        draggable={false}
      />
    </div>
  );
}
