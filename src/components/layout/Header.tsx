"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { House, LayoutGrid, MapPin, Menu, MessageCircle, Phone, Route, X, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import { navigation, navigationGroups } from "@/data/navigation";
import { siteConfig } from "@/data/site";

const navigationIcons = { home: House, bolt: Zap, grid: LayoutGrid, route: Route, map: MapPin, message: MessageCircle };

function InstagramIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".85" fill="currentColor" stroke="none" />
  </svg>;
}

function NavigationItems({ active, idPrefix, onNavigate }: { active: string; idPrefix: string; onNavigate?: () => void }) {
  return <>
    {navigationGroups.map((group, index) => <div className="nav-group" key={group.label} role="group" aria-labelledby={idPrefix + "-group-" + index}>
      <p className="nav-label" id={idPrefix + "-group-" + index}>{group.label}</p>
      <ul className="nav-group-links">
        {group.links.map(link => {
          const Icon = navigationIcons[link.icon];
          return <li key={link.href}><a className="nav-link" href={link.href} aria-current={active === link.href ? "location" : undefined} onClick={onNavigate}>
            <span className="nav-icon"><Icon size={19} strokeWidth={1.7} aria-hidden="true" /></span><span className="nav-text">{link.label}</span>
          </a></li>;
        })}
      </ul>
    </div>)}
    <div className="nav-group" role="group" aria-labelledby={idPrefix + "-social"}>
      <p className="nav-label" id={idPrefix + "-social"}>Nous suivre</p>
      <ul className="nav-group-links"><li><a className="nav-link" href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
        <span className="nav-icon"><InstagramIcon /></span><span className="nav-text">Instagram<span className="sr-only"> — nouvel onglet</span></span>
      </a></li></ul>
    </div>
  </>;
}

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
    window.addEventListener("resize", update);
    const media = window.matchMedia("(min-width: 1100px)");
    const resize = () => { if (media.matches) setIsMenuOpen(false); };
    media.addEventListener("change", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); media.removeEventListener("change", resize); };
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
        <span className="brand-crop"><span className="brand-reveal"><Image src="/logo/ncelec.png" alt="NC’ELEC" width={176} height={176} loading="eager" className="brand-image" /></span></span>
     </a>
      <p className="brand-caption">Électricité générale<br />Seine-et-Marne</p>
      <nav aria-label="Navigation principale" className="desktop-nav">
        <NavigationItems active={active} idPrefix="desktop-navigation" />
      </nav>
      <div className="sidebar-contact"><MapPin size={18} aria-hidden="true" /><p>À vos côtés à<br /><a href="#zone-intervention" className="sidebar-area-link"><strong>{siteConfig.city} et alentours</strong></a></p><a href="tel:+33684828065"><Phone size={15} aria-hidden="true" />{siteConfig.phone}</a></div>
      <ContactLink className="button button-primary header-cta">Demander un devis</ContactLink>
      <button ref={toggleRef} className="menu-toggle" type="button" aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
    </Container>
    <nav id="mobile-navigation" aria-label="Navigation mobile" className="mobile-nav" hidden={!isMenuOpen}>
      <Container>
        <NavigationItems active={active} idPrefix="mobile-navigation" onNavigate={() => setIsMenuOpen(false)} />
        <ContactLink className="button button-primary" onClick={() => setIsMenuOpen(false)}>Demander un devis</ContactLink>
      </Container>
    </nav>
  </header>;
}
