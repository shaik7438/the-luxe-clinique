import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { publishedTreatments } from "@/content/treatments";

/**
 * Appointment enquiry endpoint.
 *
 * Delivery, in order:
 *  1. ENQUIRY_WEBHOOK_URL set → forward JSON to it (CRM, Zapier/Make, email relay).
 *  2. Development → append to .data/enquiries.ndjson so the flow can be tested locally.
 *  3. Otherwise → 503 with an honest message; the form then offers phone/WhatsApp/email.
 *
 * The response never claims success unless the enquiry was actually delivered or stored.
 */

const LIMIT = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;

const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);

export async function POST(req: Request) {
  // Reject oversized bodies before parsing (the form sends well under 4 KB).
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > 16_000) return NextResponse.json({ message: "Request too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success to bots without storing anything.
  if (clean(body.company, 100)) return NextResponse.json({ message: "Thank you." });

  // Basic per-IP rate limit (best-effort; use a shared store in multi-instance deployments).
  // On Vercel x-real-ip / x-forwarded-for are set by the edge and can't be spoofed by the client.
  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const hits = (LIMIT.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (hits.length >= 5) return NextResponse.json({ message: "Too many enquiries in a short time. Please try again later or call the clinic." }, { status: 429 });
  LIMIT.set(ip, [...hits, now]);

  const data = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 20).replace(/[\s-]/g, ""),
    email: clean(body.email, 160),
    treatment: clean(body.treatment, 80),
    preferredTime: clean(body.preferredTime, 20),
    message: clean(body.message, 800),
    consent: body.consent === "yes",
    receivedAt: new Date().toISOString(),
  };

  const errors: Record<string, string> = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!/^(\+?91)?[6-9]\d{9}$/.test(data.phone) && !/^\+\d{8,15}$/.test(data.phone)) errors.phone = "Please enter a valid phone number.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please check the email address.";
  if (!data.consent) errors.consent = "Please confirm you have read the privacy notice.";
  if (data.treatment && !publishedTreatments.some((t) => t.slug === data.treatment)) data.treatment = "";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The shared secret lets the receiver (e.g. the Google Apps Script) reject anything not sent by this site.
        body: JSON.stringify({ type: "appointment-enquiry", secret: process.env.ENQUIRY_WEBHOOK_SECRET ?? "", ...data }),
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
      });
      if (!r.ok) throw new Error(`Webhook responded ${r.status}`);
      // Receivers that always answer 200 (Apps Script) report failure as {"ok":false}.
      const reply = await r.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (reply && reply.ok === false) throw new Error(`Webhook rejected the enquiry: ${reply.error ?? "unknown"}`);
      return NextResponse.json({ message: "Your enquiry has been sent. The clinic will contact you to arrange a time. This does not yet confirm an appointment." });
    } catch (e) {
      console.error("Enquiry webhook failed:", e);
      return NextResponse.json({ message: "We couldn't send your enquiry just now." }, { status: 502 });
    }
  }

  if (process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "enquiries.ndjson"), JSON.stringify(data) + "\n", "utf8");
    return NextResponse.json({ message: "Development mode: your enquiry was saved locally to .data/enquiries.ndjson. No one at the clinic has been notified." });
  }

  return NextResponse.json(
    { message: "Online enquiries are not connected yet, so your details were not sent." },
    { status: 503 },
  );
}
