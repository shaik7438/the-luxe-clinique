import { ExternalLink } from "lucide-react";
import { site } from "@/content/site";

/** Google Maps embed (no API key) pinned on the clinic's Google listing, with an "open in Maps" link. */
export default function MapEmbed({ className = "" }: { className?: string }) {
  const q = encodeURIComponent("The Luxe Clinique, 103, New Rajdhani Enclave, Swasthya Vihar, Preet Vihar, New Delhi 110092");
  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-white/80 bg-blush shadow-[0_30px_70px_rgba(123,23,52,0.14)] ${className}`}>
      <iframe
        title="Map showing The LUXE Clinique in Preet Vihar, New Delhi"
        src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        href={site.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-[13px] font-semibold text-burgundy shadow-md backdrop-blur-md transition hover:bg-white"
      >
        Open in Google Maps <ExternalLink size={14} aria-hidden />
      </a>
    </div>
  );
}
