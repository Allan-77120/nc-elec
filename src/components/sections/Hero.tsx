"use client";

import Link from "next/link";
import { Zap, ArrowRight, CalendarDays, Check } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[680px] flex-col overflow-hidden bg-dark-navy md:flex-row">
      <div className="flex w-full flex-col justify-center bg-dark-navy px-6 py-16 text-white sm:px-8 md:w-1/2 md:py-0 lg:px-12">
        <div className="animate-fade-up">
          <div className="mb-6 md:mb-8">
            <span className="inline-block text-xs font-medium uppercase tracking-widest text-electric-yellow sm:text-sm">
              &Eacute;lectricien en Seine-et-Marne
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-medium leading-tight sm:text-5xl md:mb-8 lg:text-6xl">
            Votre &eacute;lectricien
            <br />
            <span className="text-electric-yellow">de confiance</span>
            <br />
            &agrave; vos c&ocirc;t&eacute;s
          </h1>

          <div className="mb-6 text-sm font-medium text-off-white sm:text-base md:mb-8">
            <span>Installation</span>
            <span className="mx-2 text-electric-yellow">&bull;</span>
            <span>D&eacute;pannage</span>
            <span className="mx-2 text-electric-yellow">&bull;</span>
            <span>R&eacute;novation</span>
            <span className="mx-2 text-electric-yellow">&bull;</span>
            <span>Mise aux normes</span>
          </div>

          <p className="mb-8 max-w-md text-base leading-relaxed text-off-white sm:text-lg md:mb-10">
            NC&apos;ELEC vous accompagne pour vos installations, d&eacute;pannages et travaux
            de r&eacute;novation &eacute;lectrique avec s&eacute;rieux, r&eacute;activit&eacute; et professionnalisme.
          </p>
        </div>

        <div className="mb-12 flex flex-col gap-4 sm:flex-row md:mb-16">
          <Link
            href="/#contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-electric-yellow px-8 py-3 font-medium text-dark-navy transition-all duration-300 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-dark-navy"
          >
            Demander un devis
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/#rendez-vous"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded border-2 border-white px-8 py-3 text-white transition-all duration-300 hover:bg-white hover:text-dark-navy focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-dark-navy"
          >
            Prendre rendez-vous
            <CalendarDays className="h-5 w-5" />
          </Link>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/20 pt-8 sm:flex-row sm:gap-8 md:pt-10">
          {[
            "Devis gratuit",
            "Intervention rapide",
            "Travail soign\u00e9",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <Check className="h-5 w-5 flex-shrink-0 text-electric-yellow" />
              <span className="text-sm sm:text-base">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden bg-dark-navy md:flex">
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0a3a5f] to-dark-navy">
          <div className="absolute inset-0 opacity-10">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <div className="z-10 flex flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-electric-yellow/20">
              <Zap className="h-8 w-8 text-electric-yellow" />
            </div>
            <p className="px-6 text-center text-sm text-white/60">
              Photo professionnelle &agrave; venir
            </p>
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-20"
            style={{
              background: "linear-gradient(to right, rgba(6,39,71,0.8), transparent)",
            }}
          />
        </div>
      </div>

      <div className="relative flex min-h-[320px] w-full items-center justify-center bg-gradient-to-br from-[#0a3a5f] to-dark-navy md:hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="z-10 flex flex-col items-center justify-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-electric-yellow/20">
            <Zap className="h-6 w-6 text-electric-yellow" />
          </div>
          <p className="px-4 text-center text-xs text-white/60">
            Photo professionnelle &agrave; venir
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .animate-fade-up {
            animation: fadeUp 0.8s ease-out;
          }
        }
      `}</style>
    </section>
  );
}
