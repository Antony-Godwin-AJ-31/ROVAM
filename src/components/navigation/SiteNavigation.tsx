"use client";

import { Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export interface NavItem {
  href: string;
  label: string;
}

export function SiteNavigation({ brand, items }: { brand: string; items: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  if (items.length === 0) return null;

  return (
    <nav className="site-nav" data-scrolled={scrolled} data-open={menuOpen} aria-label="Sections">
      <div className="site-nav-bar">
        <a href="#top" className="site-nav-brand group flex items-center gap-1.5" aria-label="Rovina & Amrish - Back to top">
          <span className="font-script text-3xl sm:text-4xl text-[var(--color-moss)] group-hover:text-[var(--color-rose)] transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(200,137,145,0.3)]">
            {brand || "R & A"}
          </span>
          <Sparkles size={14} className="text-[var(--color-gold)] opacity-75 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300 -mt-1" aria-hidden="true" />
        </a>
        <ul className="site-nav-links">
          {items.map((i) => (
            <li key={i.href}>
              <a href={i.href}>{i.label}</a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="site-nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </div>
      <ul id="mobile-menu" className="site-nav-mobile" hidden={!menuOpen}>
        {items.map((i) => (
          <li key={i.href}>
            <a href={i.href} onClick={() => setMenuOpen(false)}>{i.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
