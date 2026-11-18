"use client";

import Script from "next/script";
import { useEffect } from "react";
import { GA_ID, track } from "@/lib/analytics";

/**
 * GA4 page views plus the clinic's lead actions, tracked from link clicks anywhere on the site:
 *   phone_call (tel:), whatsapp_click (wa.me), email_click (mailto:),
 *   book_consultation_click (/contact#enquiry links), get_directions (Google Maps links).
 * Enquiry form submissions are sent as generate_lead from AppointmentForm.
 * Mark phone_call, whatsapp_click and generate_lead as key events in GA4.
 */
export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const label = a.textContent?.trim().slice(0, 80) ?? "";
      const page = window.location.pathname;
      if (href.startsWith("tel:")) {
        if (href !== "tel:112") track("phone_call", { phone_number: href.slice(4), page });
      } else if (/wa\.me|api\.whatsapp\.com/.test(href)) track("whatsapp_click", { page });
      else if (href.startsWith("mailto:")) track("email_click", { page });
      else if (href.includes("/contact") && href.includes("#enquiry")) {
        const treatment = new URL(href, window.location.origin).searchParams.get("treatment") ?? undefined;
        track("book_consultation_click", { page, treatment, link_text: label });
      } else if (/maps\.google|google\.[a-z.]+\/maps|goo\.gl\/maps/.test(href)) track("get_directions", { page });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
