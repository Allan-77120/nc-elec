"use client";

import Link from "next/link";
import { Zap, ArrowRight, CalendarDays, Check } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[680px] flex overflow-hidden">
      {/* Left Content */}
      <div className="w-full md:w-1/2 bg-dark-navy text-white flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-16 md:py-0 animate-fade-up">
        {/* Eyebrow */}
        <div className="mb-6 md:mb-8">
          <span className="inline-block text-electric-yellow text-xs sm:text-sm font-semibold uppercase tracking-widest">
            Électricien en Seine-et-Marne
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8">
          Votre électricien
          <br />
          <span className="text-electric-yellow">de confiance</span>
          <br />
          à vos côtés
        </h1>

        {/* Services divider */}
        <div className="text-sm sm:text-base text-off-white mb-6 md:mb-8 font-medium">
          <span>Installation</span>
          <span className="text-electric-yellow mx-2">•</span>
          <span>Dépannage</span>
          <span className="text-electric-yellow mx-2">•</span>
          <span>Rénovation</span>
          <span className="text-electric-yellow mx-2">•</span>
          <span>Mise aux normes</span>
        </div>

        {/* Supporting paragraph */}
        <p className="text-off-white text-base sm:text-lg leading-relaxed mb-8 md:mb-10 max-w-md">
          NC&apos;ELEC vous accompagne pour vos installations, dépannages et travaux
          de rénovation électrique avec sérieux, réactivité et professionnalisme.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 md:mb-16 animate-fade-up-delayed">
          {/* Primary Button */}
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-electric-yellow text-dark-navy font-semibold rounded transition-all duration-300 hover:shadow-lg hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-dark-navy min-h-[48px]"
          >
            Demander un devis
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Secondary Button */}
          <Link
            href="/#rendez-vous"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-white text-white rounded transition-all duration-300 hover:bg-white hover:text-dark-navy focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-dark-navy min-h-[48px]"
          >
            Prendre rendez-vous
            <CalendarDays className="w-5 h-5" />
          </Link>
        </div>

        {/* Trust Info */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pt-8 md:pt-10 border-t border-white/20">
          {[
            "Devis gratuit",
            "Intervention rapide",
            "Travail soigné",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-electric-yellow flex-shrink-0" />
              <span className="text-sm sm:text-base">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Image Placeholder */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        {/* 
          Future: Replace this placeholder section with:
          <Image
            src="/images/hero-electrician.jpg"
            alt="Électricien NC'ELEC intervenant sur un tableau électrique"
            fill
            priority
            className="object-cover"
          />
        */}
        <div className="w-full h-full bg-gradient-to-br from-[#0a3a5f] to-dark-navy relative flex items-center justify-center">
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Center icon and label */}
          <div className="flex flex-col items-center justify-center gap-4 z-10">
            <div className="w-16 h-16 bg-electric-yellow/20 rounded-lg flex items-center justify-center">
              <Zap className="w-8 h-8 text-electric-yellow" />
            </div>
            <p className="text-sm text-white/60 text-center px-6">
              Photo professionnelle à venir
            </p>
          </div>

          {/* Dark gradient overlay on left edge */}
          <div
            className="absolute inset-y-0 left-0 w-20 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(6,39,71,0.8), transparent)",
            }}
          />
        </div>
      </div>

      {/* Mobile image placeholder */}
      <div className="md:hidden w-full bg-gradient-to-br from-[#0a3a5f] to-dark-navy min-h-[320px] relative flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 z-10">
          <div className="w-14 h-14 bg-electric-yellow/20 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-electric-yellow" />
          </div>
          <p className="text-xs text-white/60 text-center px-4">
            Photo professionnelle à venir
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

        @keyframes fadeUpDelayed {
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

          .animate-fade-up-delayed {
            animation: fadeUpDelayed 0.8s ease-out 0.2s both;
          }
        }
      `}</style>
    </section>
  );
}
