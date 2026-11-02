"use client";

import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { ArrowUpRight, CalendarDays, LoaderCircle, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { projectTypes, validateContact, type ContactErrors, type RequestType } from "@/lib/contact";
import { siteConfig } from "@/data/site";
import { createRequestId } from "@/lib/request-id";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [requestType, setRequestType] = useState<RequestType>("devis");
  const [projectType, setProjectType] = useState("");
  const pending = useRef(false);
  const requestId = useRef("");
  const lastPayload = useRef("");
  const formRef = useRef<HTMLFormElement>(null);
  const noticeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const readIntent = () => {
      const query = new URLSearchParams(window.location.search);
      setRequestType(query.get("demande") === "rendez-vous" ? "rendez-vous" : "devis");
      const project = query.get("projet");
      if (projectTypes.some((type) => type === project)) setProjectType(project!);
    };
    readIntent();
    window.addEventListener("contact-intent", readIntent);
    window.addEventListener("popstate", readIntent);
    return () => { window.removeEventListener("contact-intent", readIntent); window.removeEventListener("popstate", readIntent); };
  }, []);

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const first = Object.keys(errors)[0];
    if (first && status === "error") (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
    else noticeRef.current?.focus({ preventScroll: true });
  }, [status, errors]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    const serialized = JSON.stringify(fields);
    if (!requestId.current || serialized !== lastPayload.current) requestId.current = createRequestId();
    lastPayload.current = serialized;
    const result = validateContact({ ...fields, requestId: requestId.current });
    setErrors(result.errors);
    if (!result.data) {
      setStatus("error");
      setNotice("Vérifiez les champs indiqués avant d’envoyer votre demande.");
      const first = Object.keys(result.errors)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    pending.current = true;
    setStatus("submitting");
    setNotice("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data), signal: AbortSignal.timeout(25000),
      });
      const body = await response.json();
      if (!response.ok || body.success !== true || body.status !== "accepted") {
        if (body.errors) setErrors(body.errors);
        throw new Error(body.error || "L’envoi a échoué. Réessayez ou contactez-nous par téléphone.");
      }
      setNotice(result.data.requestType === "rendez-vous"
        ? "Votre demande de rendez-vous a été prise en charge pour envoi. NC’ELEC vous recontactera pour convenir d’un créneau. Aucun rendez-vous n’est encore réservé."
        : "Votre demande de devis a été prise en charge pour envoi. NC’ELEC pourra vous recontacter pour préciser votre projet.");
      setStatus("success");
      form.reset();
      setProjectType("");
      requestId.current = "";
      lastPayload.current = "";
    } catch (error) {
      const timeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
      setNotice(timeout ? "L’envoi n’a pas pu être confirmé. Vos informations sont conservées : réessayez ou appelez-nous." : error instanceof Error ? error.message : "L’envoi a échoué. Vos informations sont conservées.");
      setStatus("error");
    } finally { pending.current = false; }
  };

  return <section id="contact" className="section-space contact-section" aria-labelledby="contact-title">
    <Container className="contact-layout">
      <div className="contact-copy">
        <p className="eyebrow">Parlons de votre projet</p>
        <h2 id="contact-title">Une question,<br />une idée, un besoin ?</h2>
        <p className="section-intro">Décrivez-nous votre projet. Qu’il s’agisse d’un devis ou d’un premier échange, tout commence ici.</p>
        <div className="contact-details">
          <a href="tel:+33684828065"><Phone size={22} aria-hidden="true" /><span><small>Par téléphone</small><strong>{siteConfig.phone}</strong></span><ArrowUpRight size={20} aria-hidden="true" /></a>
          <a href={"mailto:" + siteConfig.email}><Mail size={22} aria-hidden="true" /><span><small>Par e-mail</small><strong>{siteConfig.email}</strong></span><ArrowUpRight size={20} aria-hidden="true" /></a>
          <div><MapPin size={22} aria-hidden="true" /><span><small>Zone d’intervention</small><strong>{siteConfig.region}</strong></span></div>
        </div>
        <p className="contact-note"><CalendarDays size={20} aria-hidden="true" /> Pour un rendez-vous, indiquez vos disponibilités. Le créneau sera convenu directement avec vous.</p>
      </div>
      <form ref={formRef} action="/api/contact" method="post" onSubmit={submit} className="contact-form" noValidate aria-busy={status === "submitting"}>
        <h3>Votre demande</h3>
        <p className="form-help">Les champs marqués d’un * sont obligatoires.</p>
        <div className="honeypot" aria-hidden="true"><label htmlFor="website">Laissez ce champ vide</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <fieldset disabled={status === "submitting"}>
          <legend className="sr-only">Informations sur votre demande</legend>
          <div className="form-grid">
            <div className="full-field"><label htmlFor="requestType">Nature de la demande *</label><select id="requestType" name="requestType" value={requestType} onChange={(event) => setRequestType(event.target.value as RequestType)} required aria-invalid={!!errors.requestType} aria-describedby={errors.requestType ? "requestType-error" : undefined}><option value="devis">Demande de devis</option><option value="rendez-vous">Demande de rendez-vous</option></select><FieldError id="requestType" error={errors.requestType} /></div>
            <Field id="name" label="Nom" autoComplete="name" placeholder="Votre nom" minLength={2} maxLength={100} error={errors.name} />
            <Field id="phone" label="Téléphone" type="tel" autoComplete="tel" inputMode="tel" placeholder="06 00 00 00 00" maxLength={30} error={errors.phone} />
            <Field id="email" label="Adresse e-mail" type="email" autoComplete="email" placeholder="vous@exemple.fr" maxLength={254} error={errors.email} className="full-field" />
            <div className="full-field"><label htmlFor="projectType">Type de projet *</label><select id="projectType" name="projectType" required value={projectType} onChange={(event) => setProjectType(event.target.value)} aria-invalid={!!errors.projectType} aria-describedby={errors.projectType ? "projectType-error" : undefined}><option value="" disabled>Sélectionnez votre projet</option>{projectTypes.map((type) => <option key={type}>{type}</option>)}</select><FieldError id="projectType" error={errors.projectType} /></div>
            <div className="full-field"><label htmlFor="message">Description du projet *</label><textarea id="message" name="message" rows={5} minLength={10} maxLength={4000} required placeholder="Vos besoins, la commune du chantier et, si vous le souhaitez, vos disponibilités…" aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-help message-error" : "message-help"} /><p id="message-help" className="field-help">Entre 10 et 4 000 caractères.</p><FieldError id="message" error={errors.message} /></div>
          </div>
          <button className="button button-primary submit-button" type="submit" disabled={status === "submitting"}>{status === "submitting" ? <>Envoi en cours… <LoaderCircle className="loading-icon" size={19} aria-hidden="true" /></> : <>Envoyer ma demande <ArrowUpRight size={20} aria-hidden="true" /></>}</button>
        </fieldset>
        <p className="privacy-note">Vos coordonnées sont utilisées pour répondre à votre demande.</p>
        {(status === "error" || status === "success") && <p ref={noticeRef} tabIndex={-1} role={status === "error" ? "alert" : "status"} className={"form-notice " + status}>{notice}</p>}
      </form>
    </Container>
  </section>;
}

function FieldError({ id, error }: { id: string; error?: string }) { return error ? <p id={id + "-error"} className="field-error">{error}</p> : null; }

function Field({ id, label, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string }) {
  return <div className={className}><label htmlFor={id}>{label} *</label><input {...props} id={id} name={id} required aria-invalid={!!error} aria-describedby={error ? id + "-error" : undefined} /><FieldError id={id} error={error} /></div>;
}
