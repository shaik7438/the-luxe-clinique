import Image from "next/image";
import { assetById } from "@/content/assets";
import { resolveImage } from "@/lib/images";
import ArtPlate from "./ArtPlate";
import IllustrativeTag from "./IllustrativeTag";

/** Server component: renders the supplied photo for a slot, or the branded art plate. */
export default function ClinicImage({
  id,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  tone,
}: {
  id: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "light" | "burgundy";
}) {
  const slot = assetById(id);
  const src = resolveImage(id);
  if (!slot) return null;
  if (!src) return <ArtPlate motif={slot.motif} className={className} tone={tone} />;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={slot.alt} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]" />
      {slot.source === "illustrative" && <IllustrativeTag />}
    </div>
  );
}
