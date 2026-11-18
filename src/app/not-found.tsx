import Link from "next/link";

export default function NotFound() {
  return (
    <section className="luxe-canvas grid min-h-[80vh] place-items-center px-4 pt-28">
      <div className="glass glass-strong max-w-lg p-10 text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="font-display mt-4 text-4xl">We couldn&apos;t find that page</h1>
        <p className="mt-3 text-muted">It may have moved as part of our new website.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Home</Link>
          <Link href="/treatments" className="btn btn-glass">Treatments</Link>
        </div>
      </div>
    </section>
  );
}
