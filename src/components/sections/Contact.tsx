"use client";

import { useState, type FormEvent } from "react";

const projectTypes = [
  "Installation électrique",
  "Dépannage",
  "Rénovation",
  "Mise aux normes",
  "Éclairage",
  "Autre",
] as const;

export function Contact() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      form.reset();
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-28 bg-slate-50 py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12">
        <div className="lg:py-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-blue">
            Contact
          </p>

          <h2
            id="contact-title"
            className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-dark-navy sm:text-4xl lg:text-5xl"
          >
            Demandez votre devis gratuitement
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Décrivez votre projet et vos besoins. Nous vous recontacterons
            rapidement afin de vous proposer une solution adaptée.
          </p>

          <ul className="mt-8 space-y-4" aria-label="Avantages">
            <ContactBenefit text="Devis gratuit et sans engagement" />
            <ContactBenefit text="Réponse rapide" />
            <ContactBenefit text="Accompagnement personnalisé" />
          </ul>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <p className="text-sm font-medium text-slate-500">
              Besoin d’une intervention rapide ?
            </p>

            <a
              href="tel:+33123456789"
              className="mt-2 inline-flex text-lg font-semibold text-dark-navy underline decoration-electric-yellow decoration-2 underline-offset-4 transition-colors duration-200 hover:text-primary-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-4"
            >
              06 84 82 80 65
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.3)] ring-1 ring-slate-200 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} noValidate>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Site internet</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                id="name"
                name="name"
                label="Nom"
                type="text"
                autoComplete="name"
                placeholder="Votre nom"
                required
              />

              <FormField
                id="phone"
                name="phone"
                label="Téléphone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="06 00 00 00 00"
                required
              />

              <FormField
                id="email"
                name="email"
                label="Adresse e-mail"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="vous@exemple.fr"
                required
                className="sm:col-span-2"
              />

              <div className="sm:col-span-2">
                <label
                  htmlFor="projectType"
                  className="mb-2 block text-sm font-semibold text-dark-navy"
                >
                  Type de projet
                </label>

                <select
                  id="projectType"
                  name="projectType"
                  required
                  defaultValue=""
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-dark-navy outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10"
                >
                  <option value="" disabled>
                    Sélectionnez un type de projet
                  </option>

                  {projectTypes.map((projectType) => (
                    <option key={projectType} value={projectType}>
                      {projectType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-dark-navy"
                >
                  Votre projet
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  placeholder="Décrivez les travaux souhaités, votre localisation et vos disponibilités."
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-base text-dark-navy outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={submitStatus === "submitting"}
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-electric-yellow px-6 py-3 text-base font-semibold text-dark-navy shadow-sm transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-electric-yellow/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-4 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {submitStatus === "submitting"
                  ? "Envoi en cours…"
                  : "Envoyer ma demande"}

                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>

              <p className="mt-4 text-center text-sm leading-6 text-slate-500">
                Vos informations seront utilisées uniquement pour répondre à
                votre demande.
              </p>

              {submitStatus === "success" && (
                <p
                  role="status"
                  className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200"
                >
                  Votre demande a bien été envoyée. Nous vous recontacterons
                  rapidement.
                </p>
              )}

              {submitStatus === "error" && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 ring-1 ring-red-200"
                >
                  L’envoi a échoué. Vérifiez vos informations puis réessayez.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

type ContactBenefitProps = {
  text: string;
};

function ContactBenefit({ text }: ContactBenefitProps) {
  return (
    <li className="flex items-center gap-3 text-base font-medium text-dark-navy">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric-yellow/20 text-primary-blue"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </span>

      {text}
    </li>
  );
}

type FormFieldProps = {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "tel";
  placeholder: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  required?: boolean;
  className?: string;
};

function FormField({
  id,
  name,
  label,
  type,
  placeholder,
  autoComplete,
  inputMode,
  required = false,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-dark-navy"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-dark-navy outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400 focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10"
      />
    </div>
  );
}