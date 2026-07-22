"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

const navigationLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "#services" },
  { label: "Réalisations", href: "#realisations" },
  { label: "À propos", href: "#a-propos" },
  { label: "Avis", href: "#avis" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 h-18
. border-b border-light-border bg-white">
      <Container className="flex items-center justify-between py-4 lg:py-5">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-lg sm:text-xl lg:text-2xl transition-colors hover:text-primary-blue focus:outline-none rounded px-1"
          style={{ color: "var(--color-dark-navy)" }}
        >
          NC&apos;ELEC
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xl font-medium text-dark-text transition-all hover:text-primary-blue hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:-translate-y-[2px] focus:outline-none rounded px-2 py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-8">
      
          <Link
            href="/#contact"
            className="px-7 py-3 bg-electric-yellow text-dark-navy font-semibold rounded text-xs transition-all hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:-translate-y-[2px] hover:brightness-95 focus:outline-none min-h-[25px] flex items-center"
          >
            Demander un devis
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-dark-text hover:bg-off-white rounded transition-colors focus:outline-none"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-light-border bg-white">
          <Container className="py-4 flex flex-col gap-4 ">
            <nav className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="px-3 py-2 text-base font-medium text-dark-text hover:text-primary-blue hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:-translate-y-[2px] transition-all rounded focus:outline-none"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-light-border pt-4 flex flex-col gap-3">
              {/* <a
                href={`tel:${siteConfig.phone}`}
                className="px-3 py-2 text-base font-medium text-dark-text hover:text-primary-blue transition-colors focus:outline-none rounded"
              >
                {siteConfig.phone}
              </a> */}
              <Link
                href="/#contact"
                onClick={closeMenu}
                className="px-7 py-3 bg-electric-yellow text-dark-navy font-semibold rounded text-center transition-all hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:-translate-y-[2px] hover:brightness-95 focus:outline-none min-h-[48px] flex items-center justify-center"
              >
                Demander un devis
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
