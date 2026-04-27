export default function BiosintexLogo({ className = '', textColor = '#FFFFFF', iconColor = '#FFFFFF' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ascending bars */}
        <rect x="1" y="22" width="6" height="9" rx="1.5" fill={iconColor} opacity="0.7"/>
        <rect x="9.5" y="15" width="6" height="16" rx="1.5" fill={iconColor} opacity="0.85"/>
        <rect x="18" y="8" width="6" height="23" rx="1.5" fill={iconColor}/>
        {/* Diagonal connecting line */}
        <line x1="4" y1="22" x2="12.5" y2="15" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <line x1="12.5" y1="15" x2="21" y2="8" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        {/* Dots at each top */}
        <circle cx="4" cy="22" r="2" fill={iconColor}/>
        <circle cx="12.5" cy="15" r="2" fill={iconColor}/>
        <circle cx="21" cy="8" r="2" fill={iconColor}/>
      </svg>
      <span style={{ color: textColor, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
        Biosintex
      </span>
    </div>
  );
}
