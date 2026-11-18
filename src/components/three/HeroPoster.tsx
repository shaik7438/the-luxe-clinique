/**
 * Static illustration of the treatment scene. Shown while the 3D scene loads,
 * when WebGL is unavailable, or if the scene errors. Pure SVG — no JS needed.
 */
export default function HeroPoster({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 520"
      className={className}
      role="img"
      aria-label="Illustration of a laser hair reduction appointment: a patient lies on a treatment bed wearing protective eye shields while a clinician in safety glasses holds a laser handpiece against the lower leg. A laser console stands beside the bed."
    >
      <defs>
        <linearGradient id="hp-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6EFEC" />
          <stop offset="1" stopColor="#EFE4DF" />
        </linearGradient>
        <linearGradient id="hp-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EADFD9" />
          <stop offset="1" stopColor="#E4D6CF" />
        </linearGradient>
        <radialGradient id="hp-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5C0F26" stopOpacity="0.18" />
          <stop offset="1" stopColor="#5C0F26" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="520" fill="url(#hp-wall)" />
      <path d="M0 380 L640 340 L640 520 L0 520 Z" fill="url(#hp-floor)" />
      {/* Arch */}
      <path d="M70 360 V170 A80 80 0 0 1 230 170 V350" fill="#EBD5D6" />
      <path d="M58 362 V170 A92 92 0 0 1 242 170 V350" fill="none" stroke="#7B1734" strokeWidth="2" />
      {/* Fluted panel */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={430 + i * 14} y={90} width={9} height={250} rx={4.5} fill="#FBF8F6" opacity={0.9} />
      ))}
      {/* Pendant */}
      <line x1="300" y1="0" x2="300" y2="62" stroke="#2C272B" strokeWidth="1.5" />
      <path d="M276 78 A24 18 0 0 1 324 78 Z" fill="#7B1734" />
      {/* Bed */}
      <ellipse cx="300" cy="420" rx="230" ry="26" fill="url(#hp-shadow)" />
      <rect x="215" y="330" width="170" height="80" rx="14" fill="#E4D9D3" />
      <rect x="120" y="300" width="350" height="34" rx="16" fill="#FBF8F6" />
      <rect x="124" y="331" width="342" height="4" fill="#7B1734" />
      {/* Patient */}
      <rect x="138" y="284" width="58" height="18" rx="9" fill="#FFFFFF" />
      <ellipse cx="166" cy="276" rx="22" ry="18" fill="#D2A084" />
      <path d="M146 280 A22 18 0 0 1 166 258 L160 290 Z" fill="#2B1E1A" />
      <rect x="164" y="266" width="18" height="7" rx="3.5" fill="#1F1C22" />
      <rect x="190" y="262" width="200" height="40" rx="20" fill="#F3E3E3" />
      <rect x="380" y="262" width="14" height="40" rx="7" fill="#FBF4F3" />
      <rect x="390" y="276" width="70" height="14" rx="7" fill="#D2A084" />
      <rect x="452" y="262" width="12" height="26" rx="6" fill="#D2A084" />
      {/* Clinician */}
      <rect x="388" y="300" width="18" height="110" rx="9" fill="#3B3539" />
      <rect x="410" y="300" width="18" height="110" rx="9" fill="#3B3539" />
      <path d="M380 312 C378 250 384 210 408 196 C432 210 440 250 436 312 Z" fill="#FFFFFF" stroke="#EADFD9" />
      <circle cx="408" cy="170" r="20" fill="#C08A6B" />
      <path d="M388 166 A20 20 0 0 1 428 166 L428 160 A20 22 0 0 0 388 160 Z" fill="#2B1E1A" />
      <rect x="392" y="166" width="32" height="8" rx="4" fill="#2F6B57" opacity="0.85" />
      <path d="M392 220 L376 256 L414 274" fill="none" stroke="#FFFFFF" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M392 220 L376 256 L414 274" fill="none" stroke="#EADFD9" strokeWidth="1" />
      {/* Handpiece */}
      <path d="M418 268 L428 280" stroke="#FDFBFA" strokeWidth="9" strokeLinecap="round" />
      <rect x="420" y="276" width="18" height="9" rx="3" fill="#FDFBFA" stroke="#D8CFCB" />
      <circle cx="424" cy="272" r="2.2" fill="#E2526F" />
      <path d="M414 266 C440 240 480 300 520 280" fill="none" stroke="#2C272B" strokeWidth="2.5" />
      {/* Console */}
      <rect x="505" y="250" width="70" height="140" rx="14" fill="#FDFBFA" stroke="#E6DCD7" />
      <rect x="505" y="296" width="70" height="7" fill="#7B1734" />
      <rect x="510" y="214" width="60" height="38" rx="6" fill="#3A1A26" />
      <circle cx="528" cy="233" r="10" fill="none" stroke="#E7A3B4" strokeWidth="3" />
      <rect x="500" y="388" width="80" height="10" rx="5" fill="#2C272B" />
    </svg>
  );
}
