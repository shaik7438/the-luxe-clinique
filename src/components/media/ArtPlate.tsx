import FaceLineArt from "@/components/art/FaceLineArt";
import type { AssetSlot } from "@/content/assets";

/**
 * Editorial beauty art plate shown in an image slot until photography is
 * supplied (see docs/ASSET_MANIFEST.md). Blush/champagne wash, pearl orbs and
 * a fine line illustration matched to the slot's subject. Decorative only.
 */
export default function ArtPlate({ motif, className = "", tone = "light" }: { motif: AssetSlot["motif"]; className?: string; tone?: "light" | "burgundy" }) {
  const dark = tone === "burgundy";
  const ink = dark ? "#F6DDE1" : "#7B1734";
  const soft = dark ? "rgba(255,255,255,0.45)" : "#C48C9A";
  return (
    <div
      aria-hidden
      className={`relative isolate overflow-hidden ${className}`}
      style={{
        background: dark
          ? "radial-gradient(120% 90% at 75% 15%, #A8475F 0%, #7B1734 48%, #4D0C20 100%)"
          : "radial-gradient(90% 70% at 70% 20%, #FFF7F3 0%, #F7E3E3 46%, #EFDCD1 100%)",
      }}
    >
      {/* Pearl orbs */}
      <div className="absolute -right-[8%] -top-[12%] h-[55%] aspect-square rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#f8e6e8_45%,rgba(240,205,212,0)_72%)] opacity-90" />
      <div className="absolute bottom-[10%] left-[8%] h-[14%] aspect-square rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#f3dce0_60%,rgba(240,205,212,0)_75%)]" />
      <div className="absolute inset-0 grid place-items-center">
        {motif === "face" || motif === "consult" ? (
          <FaceLineArt className="h-[82%] w-auto" stroke={ink} accent={soft} animate={false} />
        ) : (
          <svg viewBox="0 0 400 300" className="h-[78%] w-auto" fill="none" stroke={ink} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <Motif motif={motif} soft={soft} />
          </svg>
        )}
      </div>
    </div>
  );
}

function Motif({ motif, soft }: { motif: AssetSlot["motif"]; soft: string }) {
  switch (motif) {
    case "laser":
      // Light, not a beam: a halo with fine sparkles above smooth skin contour.
      return (
        <>
          <circle cx="200" cy="120" r="64" />
          <circle cx="200" cy="120" r="88" stroke={soft} strokeDasharray="2 7" />
          {[[150, 70], [262, 84], [236, 186], [140, 170]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y - 9} L${x} ${y + 9} M${x - 9} ${y} L${x + 9} ${y}`} stroke={soft} />
          ))}
          <path d="M60 240 C 140 210 260 210 340 240" />
          <path d="M80 256 C 150 234 250 234 320 256" stroke={soft} />
        </>
      );
    case "hair":
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${120 + i * 14} 40 C ${90 + i * 18} 120 ${190 + i * 10} 170 ${150 + i * 22} 270`} stroke={i % 2 ? soft : undefined} />
          ))}
          <path d="M260 90 c 22 -18 46 -10 52 10 c -24 4 -40 0 -52 -10 z" stroke={soft} />
        </>
      );
    case "product":
      return (
        <>
          <path d="M172 120 h56 v130 a14 14 0 0 1 -14 14 h-28 a14 14 0 0 1 -14 -14 z" />
          <path d="M184 120 v-22 h32 v22" />
          <path d="M190 98 v-26 a10 14 0 0 1 20 0 v26" stroke={soft} />
          <path d="M172 190 h56" stroke={soft} />
          <path d="M260 240 c 10 -30 40 -40 60 -30 c -6 26 -30 40 -60 30 z" stroke={soft} />
          <path d="M140 250 c -10 -30 -40 -40 -60 -30 c 6 26 30 40 60 30 z" />
        </>
      );
    case "map":
      return (
        <>
          <path d="M120 270 V130 a80 80 0 0 1 160 0 V270" />
          <path d="M140 270 V134 a60 60 0 0 1 120 0 V270" stroke={soft} />
          <path d="M200 150 c -18 0 -30 14 -30 30 c 0 24 30 50 30 50 s 30 -26 30 -50 c 0 -16 -12 -30 -30 -30 z" />
          <circle cx="200" cy="180" r="9" stroke={soft} />
        </>
      );
    case "room":
      return (
        <>
          <path d="M110 270 V120 a90 90 0 0 1 180 0 V270" />
          <path d="M150 270 c 0 -60 20 -96 50 -120 c 30 24 50 60 50 120" stroke={soft} />
          <path d="M200 150 v120" stroke={soft} />
          <path d="M170 210 c -30 -6 -44 -28 -40 -50 c 26 0 40 22 40 50 z" />
          <path d="M230 200 c 30 -6 44 -28 40 -50 c -26 0 -40 22 -40 50 z" />
        </>
      );
    case "drop":
      return (
        <>
          <path d="M200 50 C 160 110 140 150 140 185 a60 60 0 0 0 120 0 C 260 150 240 110 200 50 z" />
          <path d="M176 186 a26 26 0 0 0 24 26" stroke={soft} />
          <circle cx="110" cy="230" r="10" stroke={soft} />
          <circle cx="292" cy="96" r="7" stroke={soft} />
        </>
      );
    default:
      // "skin": petals and a droplet of serum.
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} transform={`rotate(${i * 72} 200 150)`} d="M200 150 C 176 116 180 82 200 64 C 220 82 224 116 200 150 Z" stroke={i % 2 ? soft : undefined} />
          ))}
          <circle cx="200" cy="150" r="10" />
          <path d="M300 200 c -10 16 -16 26 -16 36 a16 16 0 0 0 32 0 c 0 -10 -6 -20 -16 -36 z" stroke={soft} />
        </>
      );
  }
}
