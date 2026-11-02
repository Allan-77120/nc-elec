"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import { navigation } from "@/data/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("#accueil");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = "#accueil";
        for (const link of navigation) {
          if ((document.querySelector(link.href)?.getBoundingClientRect().top ?? Infinity) <= 160) current = link.href;
        }
        setActive(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    const media = window.matchMedia("(min-width: 1100px)");
    const resize = () => { if (media.matches) setIsMenuOpen(false); };
    media.addEventListener("change", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); media.removeEventListener("change", resize); };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIsMenuOpen(false); toggleRef.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside); };
  }, [isMenuOpen]);

  return <header ref={headerRef} className="site-header" onBlur={(event) => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setIsMenuOpen(false);
  }}>
    <a href="#main" className="skip-link">Aller au contenu</a>
    <Container className="header-inner">
      <a href="#accueil" className="brand-link" aria-label="NC’ELEC — Accueil" onClick={() => setIsMenuOpen(false)}>
        <span className="brand-crop"><Image src="/logo/ncelec.png" alt="NC’ELEC" width={176} height={176} loading="eager" className="brand-image" /></span>
      </a>
      <nav aria-label="Navigation principale" className="desktop-nav">
        {navigation.map((link) => <a key={link.href} href={link.href} aria-current={active === link.href ? "location" : undefined}>{link.label}</a>)}
      </nav>
      <ContactLink className="button button-primary header-cta">Demander un devis <ArrowUpRight size={17} aria-hidden="true" /></ContactLink>
      <button ref={toggleRef} className="menu-toggle" type="button" aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </Container>
    <nav id="mobile-navigation" aria-label="Navigation mobile" className="mobile-nav" hidden={!isMenuOpen}>
      <Container>
        {navigation.map((link) => <a key={link.href} href={link.href} aria-current={active === link.href ? "location" : undefined} onClick={() => setIsMenuOpen(false)}>{link.label}</a>)}
        <ContactLink className="button button-primary" onClick={() => setIsMenuOpen(false)}>Demander un devis <ArrowUpRight size={18} aria-hidden="true" /></ContactLink>
      </Container>
    </nav>
  </header>;
}
