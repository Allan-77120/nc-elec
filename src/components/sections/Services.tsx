"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bolt,
  House,
  Lightbulb,
  ShieldCheck,
  Wrench,
  Settings,
} from "lucide-react";

const services = [
  {
    title: "Installation électrique",
    description:
      "Installation complète ou partielle de vos équipements électriques, en construction neuve comme en rénovation.",
    icon: Bolt,
  },
  {
    title: "Dépannage électrique",
    description:
      "Recherche de panne, réparation et remise en service de votre installation avec une intervention réactive.",
    icon: Wrench,
  },
  {
    title: "Rénovation électrique",
    description:
      "Modernisation de vos installations pour améliorer la sécurité, le confort et les performances de votre logement.",
    icon: House,
  },
  {
    title: "Mise aux normes",
    description:
      "Contrôle et mise en conformité de votre installation afin de garantir votre sécurité et celle de vos équipements.",
    icon: ShieldCheck,
  },
  {
    title: "Éclairage intérieur et extérieur",
    description:
      "Installation de luminaires, spots et éclairages adaptés pour valoriser vos espaces intérieurs et extérieurs.",
    icon: Lightbulb,
  },
  {
    title: "Maintenance et entretien",
    description:
      "Vérification, entretien et remplacement de vos équipements électriques pour assurer leur bon fonctionnement.",
    icon: Settings,
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-off-white py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        <div
          className={`mb-12 max-w-2xl transition-all duration-700 sm:mb-16 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary-blue">
            Nos services
          </span>

          <h2 className="text-3xl font-medium leading-tight text-dark-navy sm:text-4xl lg:text-5xl">
            Des solutions électriques adaptées à chaque projet
          </h2>

          <p className="mt-6 text-base leading-7 text-dark-text/70 sm:text-lg">
            NC&apos;ELEC accompagne les particuliers et les professionnels pour
            leurs travaux électriques, en neuf comme en rénovation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                style={{
                  transitionDelay: `${index * 220}ms`,
                }}
                className={`group rounded-2xl border border-light-border bg-white p-8 transition-all duration-1000 hover:-translate-y-2 hover:border-electric-yellow hover:shadow-xl ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-electric-yellow transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7 text-dark-navy" />
                </div>

                <h3 className="mb-4 text-2xl font-semibold text-dark-navy">
                  {service.title}
                </h3>

                <p className="leading-8 text-dark-text/70">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
