"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { categories, publishedTreatments, type CategoryId } from "@/content/treatments";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GlassNavigation() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), setMega(false));
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const byCat = (Object.keys(categories) as CategoryId[]).map((c) => ({
    id: c,
    ...categories[c],
    items: publishedTreatments.filter((t) => t.category === c),
  }));

  const openMega = () => {
    clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMega(false), 140);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-4 sm:pt-3">
      <div
        className={`glass glass-sheen mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 !rounded-full pl-4 pr-2 transition-[background-color,box-shadow] duration-500 sm:pl-5 ${
          scrolled ? "!bg-white/80" : "!bg-white/55"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center">
          <Image src="/brand/luxe-clinique-logo.png" alt={`${site.name} — home`} width={720} height={265} priority className="logo-blend h-10 w-auto sm:h-11" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) =>
              n.href === "/treatments" ? (
                <li key={n.href} className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
                  <div className="flex items-center">
                    <Link
                      href={n.href}
                      className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${isActive(n.href) ? "text-burgundy" : "text-charcoal hover:text-burgundy"}`}
                    >
                      {n.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={mega}
                      aria-controls="mega-menu"
                      aria-label="Show treatment categories"
                      onClick={() => setMega((v) => !v)}
                      className="-ml-2 grid h-8 w-7 place-items-center rounded-full text-charcoal hover:text-burgundy"
                    >
                      <ChevronDown size={15} className={`transition-transform duration-300 ${mega ? "rotate-180" : ""}`} aria-hidden />
                    </button>
                  </div>
                  <AnimatePresence>
                    {mega && (
                      <motion.div
                        id="mega-menu"
                        initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="absolute left-1/2 top-full w-[min(940px,92vw)] -translate-x-1/2 pt-4"
                      >
                        <div className="glass glass-strong grid grid-cols-4 gap-x-6 gap-y-5 p-6">
                          {byCat.map((c) => (
                            <div key={c.id}>
                              <Link href={`/treatments?category=${c.id}`} className="eyebrow !text-[0.66rem] hover:underline">
                                {c.label}
                              </Link>
                              <ul className="mt-2 space-y-1">
                                {c.items.slice(0, 7).map((t) => (
                                  <li key={t.slug}>
                                    <Link href={`/treatments/${t.slug}`} className="block py-0.5 text-[13.5px] text-charcoal hover:text-burgundy">
                                      {t.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          <div className="glass-burgundy col-span-1 flex flex-col justify-between p-4">
                            <p className="font-display text-lg leading-snug">Not sure where to start?</p>
                            <p className="mt-2 text-[13px] text-white/80">A consultation is the first step for every treatment.</p>
                            <Link href="/contact#enquiry" className="mt-3 text-[13px] font-semibold underline underline-offset-4">
                              Book a Consultation
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={isActive(n.href) ? "page" : undefined}
                    className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${isActive(n.href) ? "text-burgundy" : "text-charcoal hover:text-burgundy"}`}
                  >
                    {n.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <a href={`tel:${site.phones[0].tel}`} className="hidden h-11 w-11 place-items-center rounded-full text-burgundy hover:bg-white/80 md:grid" aria-label={`Call ${site.phones[0].display}`}>
            <Phone size={18} aria-hidden />
          </a>
          <Link href="/contact#enquiry" className="btn btn-primary hidden !min-h-11 whitespace-nowrap !px-5 !py-2 text-[14px] md:inline-flex">
            Book a Consultation
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-charcoal hover:bg-white/80 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduced ? false : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="glass glass-strong mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-[1240px] overflow-y-auto p-5 lg:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="divide-y divide-line">
                {nav.map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: EASE }}
                  >
                    <Link
                      href={n.href}
                      aria-current={isActive(n.href) ? "page" : undefined}
                      className={`font-display flex items-center justify-between py-3.5 text-xl ${isActive(n.href) ? "text-burgundy" : "text-charcoal"}`}
                    >
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-5 grid gap-2">
              <Link href="/contact#enquiry" className="btn btn-primary w-full">
                Book a Consultation
              </Link>
              <a href={`tel:${site.phones[0].tel}`} className="btn btn-glass w-full">
                <Phone size={16} aria-hidden /> {site.phones[0].display}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
