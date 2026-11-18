// Checks SEO essentials on key pages. Usage: node scripts/seo-check.js [base-url]
const base = process.argv[2] || "https://www.luxeclinique.com";
const pages = ["/", "/treatments", "/treatments/laser-hair-reduction", "/treatments/hydrafacial", "/learn", "/learn/what-are-dermal-fillers", "/about", "/contact", "/gallery", "/patient-information"];
const decode = (s) => s && s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
const pick = (h, re) => decode((h.match(re) || [])[1]);
(async () => {
  let problems = 0;
  for (const p of pages) {
    const r = await fetch(base + p);
    const h = await r.text();
    const title = pick(h, /<title>([^<]*)<\/title>/);
    const desc = pick(h, /<meta name="description" content="([^"]*)"/);
    const canon = pick(h, /<link rel="canonical" href="([^"]*)"/);
    const og = pick(h, /<meta property="og:image" content="([^"]*)"/);
    const h1 = (h.match(/<h1[\s>]/g) || []).length;
    const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    let types = [];
    for (const j of ld) {
      try {
        const o = JSON.parse(j);
        const walk = (x) => { if (!x || typeof x !== "object") return; if (x["@type"]) types.push([].concat(x["@type"]).join("/")); (x["@graph"] || []).forEach(walk); };
        walk(o);
      } catch (e) { types.push("INVALID-JSON"); problems++; }
    }
    const issues = [];
    if (r.status !== 200) issues.push("status " + r.status);
    if (!title || title.length > 70) issues.push(`title ${title ? title.length : 0} chars`);
    if (!desc || desc.length < 70 || desc.length > 170) issues.push(`desc ${desc ? desc.length : 0} chars`);
    if (!canon) issues.push("no canonical");
    if (!og) issues.push("no og:image");
    if (h1 !== 1) issues.push(`${h1} h1`);
    problems += issues.length;
    console.log(`${p}\n  title(${title?.length}): ${title}\n  desc(${desc?.length}) canon: ${canon}\n  og: ${og}\n  schema: ${types.join(", ")}${issues.length ? "\n  ISSUES: " + issues.join("; ") : ""}`);
  }
  for (const p of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/og/default.jpg"]) {
    const r = await fetch(base + p);
    const t = p.endsWith(".jpg") ? "" : (await r.text());
    console.log(p, r.status, p === "/sitemap.xml" ? (t.match(/<loc>/g) || []).length + " urls" : t.slice(0, 80).replace(/\n/g, " "));
  }
  console.log("TOTAL ISSUES:", problems);
})();
