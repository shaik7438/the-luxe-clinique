import type { MetadataRoute } from "next";
import { articleForModule, articles } from "@/content/articles";
import { modules } from "@/content/education";
import { founderPublished, site } from "@/content/site";
import { publishedTreatments } from "@/content/treatments";

/**
 * Only articles carry a real "last updated" date, so only they get <lastmod>.
 * Stamping every URL with the build time makes Google distrust lastmod for the whole site,
 * and changefreq / priority are ignored by Google, so they are left out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/treatments", "/learn", "/patient-information", "/about", "/gallery", "/contact", "/legal/privacy", "/legal/terms", "/legal/medical-disclaimer"];
  return [
    ...staticPaths.map((p) => ({ url: `${site.url}${p}` })),
    ...(founderPublished ? [{ url: `${site.url}/about/${site.founder.slug}` }] : []),
    ...publishedTreatments.map((t) => ({ url: `${site.url}/treatments/${t.slug}` })),
    ...articles.map((a) => ({ url: `${site.url}/learn/${a.slug}`, lastModified: new Date(a.updated) })),
    // 3D guides that duplicate an article's topic canonicalise to that article, so only list the rest.
    ...Object.keys(modules)
      .filter((id) => !articleForModule(id))
      .map((id) => ({ url: `${site.url}/learn/models/${id}` })),
  ];
}
