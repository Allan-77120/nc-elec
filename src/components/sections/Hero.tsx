import Image from "next/image";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import { siteConfig } from "@/data/site";

export function Hero() {
  return <section id="accueil" className="hero" aria-labelledby="hero-title">
    <Container>
      <div className="page-topline"><span>NC’ELEC / Artisan électricien</span></div>
      <div className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow"><span /> Installation · Rénovation · Dépannage</p>
        <h1 id="hero-title">Votre <em>électricien,</em><br />en {siteConfig.region}.</h1>
        <p className="hero-description">De l’installation à la rénovation, NC’ELEC vous accompagne dans vos projets électriques, chez vous et dans vos locaux professionnels.</p>
        <div className="hero-actions">
          <ContactLink className="button button-primary">Demander un devis</ContactLink>
          <a href="#services" className="text-link">Découvrir les prestations</a>
        </div>
        <p className="hero-location"><MapPin size={17} aria-hidden="true" /> Pour votre logement et vos locaux professionnels</p>
      </div>
      <div className="hero-visual">
        <figure className="hero-photo">
          <Image src="/images/artisan-electricien.jpg" alt="Électricien au travail lors d’une rénovation intérieure" fill sizes="(min-width: 1600px) 480px, (min-width: 1100px) 32vw, (min-width: 768px) 40vw, 90vw" loading="eager" fetchPriority="high" className="object-cover" />
          <figcaption><span>Un aperçu de notre travail</span><a href="#realisations">Le soin du détail.</a></figcaption>
        </figure>
      </div>
      </div>
    </Container>
  </section>;
}
