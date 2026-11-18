import { PageHero } from "@/components/ui/blocks";

export default function LegalPage({ title, path, intro, sections }: { title: string; path: string; intro: string; sections: { h: string; p: string[] }[] }) {
  return (
    <>
      <PageHero eyebrow="Legal · Draft for review" title={title} intro={intro} crumbs={[{ href: path, label: title }]} />
      <section className="container-luxe pb-20">
        <div className="glass mb-8 max-w-3xl p-4 text-[13.5px] text-muted">
          <strong className="text-charcoal">Draft:</strong> this page is a starting template and must be reviewed by a qualified Indian legal professional and the clinic before publication.
        </div>
        <div className="prose-luxe">
          {sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <p className="mt-10 text-[13px] text-muted">Last updated: 16 October 2026 (draft)</p>
        </div>
      </section>
    </>
  );
}
