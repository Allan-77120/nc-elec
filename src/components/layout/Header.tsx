"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";

const navigationLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "#services" },
  { label: "R\u00e9alisations", href: "#realisations" },
  { label: "\u00c0 propos", href: "#a-propos" },
  { label: "Avis", href: "#avis" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-light-border bg-white shadow-sm">
      <Container className="flex h-30 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
          aria-label="Accueil NC'ELEC"
        >
          <Image
            src="/logo/ncelec.png"
            alt="NC'ELEC"
            width={124}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-2 lg:gap-3">
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded border border-transparent px-3 py-2 text-xl font-medium text-black transition-colors duration-300 hover:!text-[#ceb477] focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 lg:px-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex shrink-0 items-center">
          <Link
            href="/#contact"
            className="inline-flex min-h-11 items-center justify-center rounded px-5 py-2.5 text-xl font-medium text-black transition-colors duration-300 hover:!text-[#ceb477] focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
          >
            Demander un devis
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden rounded p-2 text-dark-text transition-colors hover:bg-off-white focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </Container>

      {isMenuOpen && (
        <div className="md:hidden border-t border-light-border bg-white shadow-sm">
          <Container className="flex flex-col gap-4 py-4">
            <nav className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded border border-transparent px-3 py-2 text-base font-medium text-black transition-colors duration-300 hover:!text-[#ceb477] focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-light-border pt-4">
              <Link
                href="/#contact"
                onClick={closeMenu}
                className="inline-flex min-h-12 w-full items-center justify-center rounded px-5 py-3 text-center text-sm font-medium text-black transition-colors duration-300 hover:!text-[#ceb477] focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
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
