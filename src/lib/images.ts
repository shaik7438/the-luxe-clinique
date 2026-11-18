// Server-only: uses the filesystem at build/render time.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { assetById } from "@/content/assets";

const EXT = ["webp", "avif", "jpg", "jpeg", "png"];
const dir = path.join(process.cwd(), "public", "images");
const versions = new Map<string, string>();

/** Short content hash, so a replaced photo gets a new URL and no browser or CDN keeps showing the old one. */
function version(file: string): string {
  let v = versions.get(file);
  if (!v) {
    v = crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex").slice(0, 8);
    versions.set(file, v);
  }
  return v;
}

/** Returns the public URL of a supplied photo for an asset slot, or null if none has been added yet. */
export function resolveImage(id: string): string | null {
  for (const ext of EXT) {
    const file = path.join(dir, `${id}.${ext}`);
    if (fs.existsSync(file)) return `/images/${id}.${ext}?v=${version(file)}`;
  }
  return null;
}

/** Resolve an asset slot to a ready-to-render image, or null if no file has been supplied. */
export function slotImage(id: string): { src: string; alt: string; illustrative: boolean } | null {
  const src = resolveImage(id);
  const slot = assetById(id);
  if (!src) return null;
  return { src, alt: slot?.alt ?? "", illustrative: slot ? slot.source === "illustrative" : true };
}
