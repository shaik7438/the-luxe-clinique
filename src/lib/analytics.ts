/** Google Analytics 4 helpers. Everything is a no-op until NEXT_PUBLIC_GA_MEASUREMENT_ID is set. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

/** Send a GA4 event, e.g. track("generate_lead", { method: "enquiry_form" }). */
export function track(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !GA_ID) return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
