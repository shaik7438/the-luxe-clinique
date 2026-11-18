"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; message: string }
  | { kind: "unavailable"; message: string }
  | { kind: "error"; message: string };

type Errors = Partial<Record<"name" | "phone" | "email" | "consent", string>>;

export default function AppointmentForm({ treatmentOptions }: { treatmentOptions: { value: string; label: string }[] }) {
  const params = useSearchParams();
  const uid = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const preset = params.get("treatment") ?? "";

  const validate = (fd: FormData): Errors => {
    const e: Errors = {};
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").replace(/[\s-]/g, "");
    const email = String(fd.get("email") ?? "").trim();
    if (name.length < 2) e.name = "Please enter your name.";
    if (!/^(\+?91)?[6-9]\d{9}$/.test(phone) && !/^\+\d{8,15}$/.test(phone)) e.phone = "Please enter a valid phone number, e.g. 98765 43210.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please check the email address.";
    if (!fd.get("consent")) e.consent = "Please confirm you have read the privacy notice.";
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; errors?: Errors };
      if (res.ok) {
        setStatus({ kind: "sent", message: data.message ?? "Your enquiry has been received." });
        track("generate_lead", { method: "enquiry_form", treatment: String(fd.get("treatment") ?? "") || undefined });
        form.reset();
      } else if (res.status === 503) {
        setStatus({ kind: "unavailable", message: data.message ?? "Online enquiries are not connected yet." });
      } else if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
      } else {
        setStatus({ kind: "error", message: data.message ?? "Something went wrong. Please try again or contact the clinic directly." });
      }
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the server. Please check your connection or contact the clinic directly." });
    }
  };

  const field = "mt-1.5 h-12 w-full rounded-2xl border bg-white/80 px-4 text-[15px] outline-none transition focus:border-burgundy focus:ring-2 focus:ring-burgundy/15";
  const err = (k: keyof Errors) => (errors[k] ? "border-[#B3261E]" : "border-line");

  if (status.kind === "sent") {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass glass-strong p-8 text-center" role="status">
        <CheckCircle2 size={40} className="mx-auto text-burgundy" aria-hidden />
        <h3 className="font-display mt-4 text-2xl">Thank you</h3>
        <p className="mx-auto mt-2 max-w-md text-muted">{status.message}</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="btn btn-glass mt-6">
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="glass glass-strong p-6 sm:p-8" aria-describedby={`${uid}-note`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-name`} className="text-[14px] font-semibold">
            Full name <span aria-hidden className="text-burgundy">*</span>
          </label>
          <input id={`${uid}-name`} name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-e` : undefined} className={`${field} ${err("name")}`} />
          {errors.name && <FieldError id={`${uid}-name-e`}>{errors.name}</FieldError>}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="text-[14px] font-semibold">
            Phone <span aria-hidden className="text-burgundy">*</span>
          </label>
          <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-phone-e` : undefined} className={`${field} ${err("phone")}`} />
          {errors.phone && <FieldError id={`${uid}-phone-e`}>{errors.phone}</FieldError>}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="text-[14px] font-semibold">
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}-email-e` : undefined} className={`${field} ${err("email")}`} />
          {errors.email && <FieldError id={`${uid}-email-e`}>{errors.email}</FieldError>}
        </div>
        <div>
          <label htmlFor={`${uid}-treatment`} className="text-[14px] font-semibold">
            Area of interest <span className="font-normal text-muted">(optional)</span>
          </label>
          <select id={`${uid}-treatment`} name="treatment" defaultValue={preset} className={`${field} border-line`}>
            <option value="">Not sure yet — general consultation</option>
            {treatmentOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-time`} className="text-[14px] font-semibold">
            Preferred contact time <span className="font-normal text-muted">(optional)</span>
          </label>
          <select id={`${uid}-time`} name="preferredTime" className={`${field} border-line`} defaultValue="">
            <option value="">Any time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-msg`} className="text-[14px] font-semibold">
            Message <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea id={`${uid}-msg`} name="message" rows={4} maxLength={800} className={`${field} h-auto border-line py-3`} placeholder="Preferred dates or administrative questions. Please don't include detailed medical information." />
        </div>
        {/* Honeypot — hidden from people, tempting to bots */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label>
            Company <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-[14px] leading-relaxed">
            <input type="checkbox" name="consent" value="yes" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${uid}-consent-e` : undefined} className="mt-1 h-5 w-5 shrink-0 accent-[#7B1734]" />
            <span>
              I agree that the clinic may use these details to contact me about my enquiry, as described in the{" "}
              <Link href="/legal/privacy" className="font-semibold text-burgundy underline">privacy notice</Link>.
            </span>
          </label>
          {errors.consent && <FieldError id={`${uid}-consent-e`}>{errors.consent}</FieldError>}
        </div>
      </div>

      <p id={`${uid}-note`} className="mt-5 rounded-2xl bg-burgundy/[0.05] p-4 text-[13px] leading-relaxed text-muted">
        This form is for appointment and administrative requests only. It is not monitored for medical emergencies — for urgent concerns call 112 or contact a doctor directly. Submitting does not confirm an appointment or your suitability for any treatment.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status.kind === "sending"} className="btn btn-primary disabled:opacity-70">
          {status.kind === "sending" ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            "Send enquiry"
          )}
        </button>
        <span className="text-[13px] text-muted">
          <span aria-hidden className="text-burgundy">*</span> required
        </span>
      </div>

      <div aria-live="assertive">
        <AnimatePresence>
          {(status.kind === "error" || status.kind === "unavailable") && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 rounded-2xl border border-[#B3261E]/25 bg-[#B3261E]/[0.05] p-4" role="alert">
              <p className="flex gap-2 text-[14px] font-semibold text-[#8C1D18]">
                <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden /> {status.message}
              </p>
              <p className="mt-2 text-[14px] text-charcoal">Please contact the clinic directly:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={`tel:${site.phones[0].tel}`} className="btn btn-glass !min-h-10 !py-2 text-sm"><Phone size={15} aria-hidden /> Call</a>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-glass !min-h-10 !py-2 text-sm"><MessageCircle size={15} aria-hidden /> WhatsApp</a>
                <a href={`mailto:${site.email}?subject=${encodeURIComponent("Appointment enquiry")}`} className="btn btn-glass !min-h-10 !py-2 text-sm"><Mail size={15} aria-hidden /> Email</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[#B3261E]">
      <AlertCircle size={14} aria-hidden /> {children}
    </p>
  );
}
