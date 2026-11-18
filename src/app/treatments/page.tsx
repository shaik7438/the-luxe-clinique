import { Suspense } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { slotImage } from "@/lib/images";
import TreatmentDirectory, { type DirectoryItem } from "@/components/treatments/TreatmentDirectory";
import { ConsultationCTA, PageHero, ReviewNotice } from "@/components/ui/blocks";
import { categories, concernLabels, publishedTreatments, type CategoryId, type ConcernId } from "@/content/treatments";
import { toTopicCard } from "@/lib/cards";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Treatments in Preet Vihar, East Delhi",
  description:
    "Skin, hair, laser and injectable treatments in Preet Vihar, East Delhi: HydraFacial, peels, fillers, laser hair reduction and more, with aftercare guidance.",
  path: "/treatments",
});

export default function TreatmentsPage() {
  const items: DirectoryItem[] = publishedTreatments.map((t) => ({
    ...toTopicCard(t),
    category: t.category,
    concerns: t.concerns,
    keywords: [t.summary, ...t.intendedFor, ...t.concerns.map((c) => concernLabels[c])].join(" ").toLowerCase(),
  }));
  const usedConcerns = new Set(publishedTreatments.flatMap((t) => t.concerns));

  return (
    <>
      <PageHero
        image={slotImage("cat-skin")}
        eyebrow="Skin, laser & aesthetic treatments · East Delhi"
        eyebrowInH1
        title="Treatments,"
        accent="tailored to you"
        intro="Facials, injectables, laser, peels and more — each with a full guide to how it works, who it suits, preparation and aftercare. Your plan is always confirmed at consultation."
        crumbs={[{ href: "/treatments", label: "Treatments" }]}
      />
      <section className="container-luxe pb-20">
        <Suspense fallback={<div className="glass h-40 animate-pulse" />}>
          <TreatmentDirectory
            items={items}
            categories={(Object.keys(categories) as CategoryId[]).map((id) => ({ id, label: categories[id].label }))}
            concerns={(Object.keys(concernLabels) as ConcernId[]).filter((c) => usedConcerns.has(c)).map((id) => ({ id, label: concernLabels[id] }))}
          />
        </Suspense>
        <section aria-labelledby="menu-overview" className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="menu-overview" className="font-display text-[1.9rem] leading-tight text-charcoal">
              Skin, hair &amp; laser treatments in Preet Vihar
            </h2>
          </div>
          <div className="space-y-4 text-[15.5px] leading-relaxed text-muted lg:col-span-8">
            <p>
              The LUXE Clinique offers {publishedTreatments.length} skin, hair, laser and aesthetic treatments at {site.address.line1},{" "}
              {site.address.locality}, East Delhi, near Preet Vihar Metro Station. Many patients visit from {site.nearbyAreas.slice(0, -1).join(", ")} and{" "}
              {site.nearbyAreas[site.nearbyAreas.length - 1]}.
            </p>
            <p>
              Every treatment starts with a personal consultation. We look at your skin, history and goals, then talk through suitable options,
              the results you can realistically expect, the risks and the aftercare before anything is decided. Each guide on this page explains how a
              treatment works, who it may suit, how to prepare and what recovery looks like.
            </p>
            <ul className="grid gap-3 pt-2 sm:grid-cols-2">
              {(Object.keys(categories) as CategoryId[]).map((id) => (
                <li key={id}>
                  <Link href={`/treatments?category=${id}`} className="font-semibold text-burgundy hover:underline">
                    {categories[id].label}
                  </Link>
                  <span className="block text-[14px]">{categories[id].blurb}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <ReviewNotice className="mt-12" />
      </section>
      <ConsultationCTA />
    </>
  );
}
