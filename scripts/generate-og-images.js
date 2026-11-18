// Builds the 1200×630 social-preview (Open Graph) images:
//   public/og/default.jpg and public/og/treatments/<slug>.jpg
// Run from the project root: node scripts/generate-og-images.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text, max) {
  const lines = [];
  let cur = "";
  for (const word of text.split(" ")) {
    if ((cur + " " + word).trim().length > max) {
      lines.push(cur.trim());
      cur = word;
    } else cur += " " + word;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

async function make(photo, title, sub, out) {
  const W = 1200, H = 630, P = 660;
  const left = await sharp(photo).resize(P, H, { fit: "cover", position: sharp.strategy.attention }).toBuffer();
  const logo = await sharp(path.join(root, "public/brand/luxe-clinique-logo.png")).resize({ width: 300 }).toBuffer();
  const lines = wrap(title, 18).slice(0, 3);
  const titleSvg = lines
    .map((l, i) => `<text x="${P + 50}" y="${300 + i * 58}" font-family="Georgia, 'Times New Roman', serif" font-size="50" fill="#2A2226">${esc(l)}</text>`)
    .join("");
  const svg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF2EF"/><stop offset="1" stop-color="#F3E1DD"/></linearGradient></defs>
    <rect x="${P}" y="0" width="${W - P}" height="${H}" fill="url(#g)"/>
    <rect x="${P}" y="0" width="6" height="${H}" fill="#7B1734"/>
    ${titleSvg}
    <text x="${P + 50}" y="${300 + lines.length * 58 + 26}" font-family="Arial, sans-serif" font-size="22" fill="#7B1734" letter-spacing="3">${esc(sub)}</text>
    <text x="${P + 50}" y="${H - 50}" font-family="Arial, sans-serif" font-size="21" fill="#5D555B">Preet Vihar, New Delhi · +91 89202 19690</text>
  </svg>`);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#FBF2EF" } })
    .composite([{ input: left, left: 0, top: 0 }, { input: svg, left: 0, top: 0 }, { input: logo, left: P + 46, top: 60 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
}

(async () => {
  fs.mkdirSync(path.join(root, "public/og/treatments"), { recursive: true });
  await make(
    path.join(root, "public/images/home-clinic-interior.webp"),
    "Beauty & aesthetic care, consultation first",
    "SKIN · HAIR · LASER · WELLNESS",
    path.join(root, "public/og/default.jpg"),
  );
  const src = fs.readFileSync(path.join(root, "src/content/treatments.ts"), "utf8");
  const items = [...src.matchAll(/slug: "([^"]+)",\s*\n\s*name: "([^"]+)"/g)].map((m) => [m[1], m[2]]);
  let n = 0;
  for (const [slug, name] of items) {
    const photo = path.join(root, "public/images/treatments", slug + ".webp");
    if (!fs.existsSync(photo)) continue;
    await make(photo, name.split(" (")[0], "TREATMENTS · THE LUXE CLINIQUE", path.join(root, "public/og/treatments", slug + ".jpg"));
    n++;
  }
  console.log("default + " + n + " treatment images");
})();
