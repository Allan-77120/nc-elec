import Link from "next/link";
import { ArrowRight, CalendarDays, Check } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[720px] flex-col overflow-hidden bg-dark-navy md:flex-row">
      <div className="flex w-full flex-col justify-center gap-12 bg-dark-navy px-6 py-16 text-white sm:px-8 md:w-[55%] md:py-20 lg:px-16 xl:px-20">
        <div className="animate-fade-up flex flex-col gap-8">
          <h1 className="text-4xl font-medium leading-[1.15] sm:text-5xl lg:text-6xl">
            Votre électricien
            <br />
            <span className="text-electric-yellow">de confiance</span>
            <br />à vos côtés
          </h1>

          <div className="flex max-w-lg flex-wrap items-center gap-y-2 text-sm font-medium text-off-white sm:text-base">
            <span>Installation</span>
            <span className="mx-3 text-electric-yellow">•</span>

            <span>Dépannage</span>
            <span className="mx-3 text-electric-yellow">•</span>

            <span>Rénovation</span>
            <span className="mx-3 text-electric-yellow">•</span>

            <span>Mise aux normes</span>
          </div>

          <p className="max-w-lg text-base leading-8 text-off-white sm:text-lg">
            NC&apos;ELEC vous accompagne pour vos installations, dépannages et
            travaux de rénovation électrique avec sérieux, réactivité et
            professionnalisme.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/#contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-electric-yellow px-8 py-3 font-medium text-dark-navy transition-all duration-300 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-dark-navy"
          >
            Demander un devis
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/#rendez-vous"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded border-2 border-white px-8 py-3 text-white transition-all duration-300 hover:bg-white hover:!text-dark-navy focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-dark-navy"
          >
            Prendre rendez-vous
            <CalendarDays className="h-5 w-5" />
          </Link>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/20 pt-8 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-5">
          {["Devis gratuit", "Intervention rapide", "Travail soigné"].map(
            (item) => (
              <div key={item} className="flex items-center gap-3">
                <Check className="h-5 w-5 flex-shrink-0 text-electric-yellow" />
                <span className="text-sm sm:text-base">{item}</span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="hidden w-1/2 bg-primary-blue md:block md:w-[45%]" />
    </section>
  );
}
