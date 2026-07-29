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
    title: "Éclairage",
    description:
      "Installation de luminaires, spots et éclairages adaptés pour valoriser vos espaces intérieurs et extérieurs.",
    icon: Lightbulb,
  },
  {
    title: "Maintenance",
    description:
      "Vérification, entretien et remplacement de vos équipements électriques pour assurer leur bon fonctionnement.",
    icon: Settings,
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [areCardsVisible, setAreCardsVisible] = useState(false);

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

  useEffect(() => {
    const cards = cardsRef.current;

    if (!cards) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAreCardsVisible(true);
          observer.unobserve(cards);
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -15% 0px",
      },
    );

    observer.observe(cards);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-off-white py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 sm:gap-20 sm:px-8 lg:gap-24 lg:px-12">
        <div
          className={`flex w-full flex-col items-center gap-7 text-center transition-[opacity,translate] duration-700 motion-reduce:translate-y-0 motion-reduce:transition-none sm:gap-8 lg:gap-10 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <span className="inline-block text-xl font-semibold uppercase tracking-[0.2em] text-primary-blue">
            Nos services
          </span>

          <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-tight text-dark-navy sm:text-4xl lg:text-5xl">
            Des solutions électriques adaptées à chaque projet
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                style={{
                  transitionDelay: `${index * 260}ms`,
                }}
                className={`h-full transition-[opacity,translate] duration-[1400ms] ease-in-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
                  areCardsVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
              >
                <article className="group flex h-full min-h-60 flex-col rounded-2xl border border-light-border bg-white p-8 transition-[translate,box-shadow,border-color] duration-[700ms] ease-in-out hover:-translate-y-2 hover:border-electric-yellow hover:shadow-xl motion-reduce:hover:translate-y-0 motion-reduce:transition-none sm:p-10">
                  <div className="grid min-h-16 grid-cols-[4rem_1fr_4rem] items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center justify-self-center rounded-xl bg-electric-yellow ring-1 ring-dark-navy/5 transition-transform duration-[850ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110 motion-reduce:transition-none">
                      <Icon className="h-7 w-7 text-dark-navy" aria-hidden="true" />
                    </div>

                    <h3 className="text-center text-xl font-semibold leading-snug text-dark-navy sm:text-2xl">
                      {service.title}
                    </h3>

                    <span aria-hidden="true" />
                  </div>

                  <div
                    aria-hidden="true"
                    className="my-6 h-px w-full bg-light-border transition-colors duration-300 group-hover:bg-electric-yellow/70 sm:my-7"
                  />

                  <p className="flex w-full flex-1 items-center justify-center px-4 text-center text-base leading-7 text-pretty text-dark-text/70 sm:leading-8">
                    {service.description}
                  </p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
