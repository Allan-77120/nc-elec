import Image from "next/image";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import { siteConfig } from "@/data/site";

export function Hero() {
  return <section id="accueil" className="hero" aria-labelledby="hero-title">
    <Container className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow"><span /> NC’ELEC · Électricité générale</p>
        <h1 id="hero-title">Votre électricien<br /><span>de confiance</span><br />à vos côtés</h1>
        <p className="hero-description">De l’installation à la rénovation, NC’ELEC vous accompagne dans vos projets électriques, chez vous et dans vos locaux professionnels.</p>
        <ul className="hero-services" aria-label="Nos prestations">
          {["Installation", "Dépannage", "Rénovation", "Mise aux normes"].map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="hero-actions">
          <ContactLink className="button button-primary">Demander un devis <ArrowUpRight size={19} aria-hidden="true" /></ContactLink>
          <a href="#realisations" className="button button-outline">Découvrir nos réalisations <ArrowDown size={18} aria-hidden="true" /></a>
        </div>
        <p className="hero-location"><MapPin size={17} aria-hidden="true" /> À vos côtés en {siteConfig.region}</p>
      </div>
      <div className="hero-visual">
        <div className="hero-circuit" aria-hidden="true" />
        <figure className="hero-photo">
          <Image src="/images/finale.jpeg" alt="Tableau électrique équipé de son capot après intervention" fill sizes="(min-width: 1100px) 480px, (min-width: 768px) 40vw, 90vw" loading="eager" fetchPriority="high" className="object-cover" />
          <figcaption><span>Un aperçu de notre travail</span><a href="#realisations">Les détails font la différence <ArrowUpRight size={21} aria-hidden="true" /></a></figcaption>
        </figure>
      </div>
    </Container>
  </section>;
}
