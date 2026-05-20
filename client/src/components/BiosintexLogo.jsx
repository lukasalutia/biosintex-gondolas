export default function BiosintexLogo({ className = '', height = 40 }) {
  return (
    <img
      src="/biosintex-logo.png"
      alt="Biosintex — Siempre en tu farmacia"
      className={className}
      style={{ height, width: 'auto', display: 'block' }}
    />
  );
}
