import type { SkinState, StructureId } from "@/content/education";

/**
 * Static, state-aware SVG cross-section. Used as the no-WebGL / reduced-data
 * fallback for every educational module and as gallery artwork.
 */
export default function SkinIllustration({
  state = {},
  highlight,
  title = "Simplified cross-section of skin",
  className = "",
}: {
  state?: SkinState;
  highlight?: StructureId | null;
  title?: string;
  className?: string;
}) {
  const hl = (id: StructureId) => (highlight === id ? { stroke: "#7B1734", strokeWidth: 3 } : {});
  const scar = state.scar ?? 0;
  const dentPath = (y: number, depth: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 64; i++) {
      const x = (i / 64) * 640;
      const d = depth * 30 * Math.exp(-((x - 420) ** 2) / (2 * 45 ** 2));
      pts.push(`${x.toFixed(1)},${(y + d).toFixed(1)}`);
    }
    return pts;
  };
  const epiTop = dentPath(70, scar);
  const epiBot = dentPath(100, scar * 0.8);
  const melanin = Math.round(60 * (state.melaninEpi ?? 0.35));
  const deep = Math.round(30 * (state.melaninDermal ?? 0));
  const fibres = Math.round(26 * (state.collagen ?? 0.7));
  const tones = state.hairTone === "light" ? ["#D8BF8C", "#D8BF8C", "#D8BF8C", "#D8BF8C"] : state.hairTone === "mixed" ? ["#2A1C17", "#D8BF8C", "#2A1C17", "#D8BF8C"] : ["#2A1C17", "#2A1C17", "#2A1C17", "#2A1C17"];
  const lens = state.phases ? [230, 150, 230, 100] : [230, 230, 230, 230];
  const rand = (i: number) => ((Math.sin(i * 91.7) + 1) / 2) % 1;

  return (
    <svg viewBox="0 0 640 420" className={className} {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}>
      {title && <title>{title}</title>}
      {/* Subcutis */}
      <rect x="0" y="300" width="640" height="120" fill="#F2D7A0" {...hl("subcutis")} />
      {Array.from({ length: 26 }).map((_, i) => (
        <circle key={i} cx={20 + (i % 13) * 49} cy={330 + Math.floor(i / 13) * 50} r="22" fill="#F7E4B3" stroke="#EBCB86" strokeWidth="1" />
      ))}
      {/* Dermis */}
      <polygon points={[...epiBot, "640,300", "0,300"].join(" ")} fill="#E8A9A6" {...hl("dermis")} />
      {Array.from({ length: fibres }).map((_, i) => {
        const x = rand(i) * 560;
        const y = 120 + rand(i + 50) * 160;
        return <path key={i} d={`M${x} ${y} q 20 -10 40 0 t 40 0 t 40 0`} stroke="#FFF4F0" strokeWidth="3" fill="none" opacity="0.9" {...hl("collagen")} />;
      })}
      {/* Vessels */}
      <path d="M0 280 C 80 260 120 300 200 275 S 360 250 420 280 S 560 300 640 270" stroke="#C8414F" strokeWidth="6" fill="none" {...hl("vessels")} />
      <path d="M0 292 C 90 280 140 310 220 290 S 380 270 440 295 S 580 305 640 288" stroke="#6A6FB0" strokeWidth="6" fill="none" />
      {/* Deep pigment */}
      {Array.from({ length: deep }).map((_, i) => (
        <circle key={i} cx={260 + rand(i + 9) * 260} cy={115 + rand(i + 19) * 70} r="4" fill="#5B3A2A" />
      ))}
      {/* Sweat gland */}
      <path d="M560 105 C 570 150 550 190 565 240" stroke="#A9CFDD" strokeWidth="5" fill="none" />
      <circle cx="565" cy="260" r="20" fill="none" stroke="#A9CFDD" strokeWidth="8" {...hl("sweat")} />
      {/* Follicles */}
      {[90, 210, 330, 470].map((x, i) => {
        if (scar > 0 && Math.abs(x - 420) < 70) return null;
        const len = lens[i];
        const acne = i === 2;
        return (
          <g key={x} transform={`rotate(12 ${x} 70)`}>
            <rect x={x - 12} y={70} width={24} height={len} rx={12} fill="#F3C3B9" {...hl("follicle")} />
            <ellipse cx={x} cy={70 + len} rx={len > 200 ? 20 : 12} ry={len > 200 ? 22 : 13} fill={tones[i] === "#2A1C17" ? "#6B4A3C" : "#D9BE91"} {...hl("bulb")} />
            {state.pulse && tones[i] === "#2A1C17" && len > 200 && <circle cx={x} cy={70 + len} r={34} fill="#FF9A6B" opacity="0.35" />}
            <rect x={x - 3.5} y={-40} width={7} height={len + 110} rx={3.5} fill={tones[i]} {...hl("shaft")} />
            <g transform={`translate(${x + 16} ${125}) scale(${acne ? state.glandScale ?? 1 : 1})`}>
              <circle r="11" fill="#F4D27A" {...hl("sebaceous")} />
              <circle cx="10" cy="10" r="9" fill="#F4D27A" />
              <circle cx="3" cy="20" r="8" fill="#F4D27A" />
            </g>
            {acne && state.plug && <circle cx={x} cy={84} r={13} fill="#CDB26A" />}
            {acne && state.plug && <circle cx={x} cy={76} r={7} fill="#3E3127" />}
            {acne && state.inflammation && <circle cx={x} cy={150} r={62} fill="#E0465A" opacity="0.22" />}
            {state.phases && (
              <text x={x} y={70 + len + 42} textAnchor="middle" fontSize="12" fill="#242126" fontFamily="Inter, sans-serif">
                {["anagen", "catagen", "anagen", "telogen"][i]}
              </text>
            )}
          </g>
        );
      })}
      {/* Epidermis */}
      <polygon points={[...epiTop, ...[...epiBot].reverse()].join(" ")} fill="#F0CDB6" {...hl("epidermis")} />
      {Array.from({ length: melanin }).map((_, i) => (
        <circle key={i} cx={6 + rand(i + 3) * 628} cy={93 + rand(i + 7) * 5 + (scar ? 0 : 0)} r="3" fill="#4A2B1D" {...hl("melanin")} />
      ))}
      {state.pulse &&
        [0, 1, 2].map((i) => <rect key={i} x="0" y={20 + i * 16} width="640" height="5" fill="#FFD6C2" opacity={0.5 - i * 0.12} />)}
      {/* Layer captions */}
      <g fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#242126">
        <text x="8" y="62">Epidermis</text>
        <text x="8" y="140" fill="#5C0F26">Dermis</text>
        <text x="8" y="412" fill="#6b5a2a">Subcutaneous tissue</text>
      </g>
    </svg>
  );
}
