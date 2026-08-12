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
    <header className="sticky top-0 z-50 border-b border-light-border bg-white/80 shadow-sm backdrop-blur-md">
      <Link
        href="/"
        className="absolute left-0 top-[calc(50%+10px)] hidden -translate-y-1/2 items-center rounded focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 lg:flex"
        aria-label="Accueil NC'ELEC"
      >
        <Image
          src="/logo/ncelec.png"
          alt="NC'ELEC"
          width={160}
          height={160}
          priority
          className="h-40 w-40 object-contain"
        />
      </Link>

      <Link
        href="/#contact"
        className="absolute right-6 top-1/2 hidden min-h-11 -translate-y-1/2 items-center justify-center rounded px-5 py-2.5 text-2xl font-medium text-black transition-colors duration-300 hover:!text-[#ceb477] focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 lg:inline-flex"
      >
        Demander un devis
      </Link>

      <Container className="relative flex h-30 items-center justify-between gap-6">
        <Link
          href="/"
          className="-ml-4 flex translate-y-[10px] shrink-0 items-center rounded focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 sm:-ml-6 lg:hidden"
          aria-label="Accueil NC'ELEC"
        >
          <Image
            src="/logo/ncelec.png"
            alt="NC'ELEC"
            width={160}
            height={160}
            priority
            className="h-40 w-40 object-contain"
          />
        </Link>

        <div className="hidden w-40 shrink-0 lg:block" aria-hidden="true" />

        <nav className="hidden md:flex flex-1 items-center justify-center gap-4 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:gap-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap rounded border border-transparent px-3 py-2 text-2xl font-medium text-black transition-colors duration-300 hover:!text-[#ceb477] focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 lg:px-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center md:flex lg:hidden">
          <Link
            href="/#contact"
            className="inline-flex min-h-11 items-center justify-center rounded px-5 py-2.5 text-2xl font-medium text-black transition-colors duration-300 hover:!text-[#ceb477] focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
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
                  className="rounded border border-transparent px-3 py-2 text-lg font-medium text-black transition-colors duration-300 hover:!text-[#ceb477] focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-light-border pt-4">
              <Link
                href="/#contact"
                onClick={closeMenu}
                className="inline-flex min-h-12 w-full items-center justify-center rounded px-5 py-3 text-center text-lg font-medium text-black transition-colors duration-300 hover:!text-[#ceb477] focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
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
