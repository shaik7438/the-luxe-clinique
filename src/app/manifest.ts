import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F5",
    theme_color: "#7B1734",
    icons: [
      { src: "/icon.png", sizes: "208x208", type: "image/png" },
      { src: "/apple-icon.png", sizes: "208x208", type: "image/png" },
    ],
  };
}
