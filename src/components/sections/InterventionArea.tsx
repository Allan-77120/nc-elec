import { Container } from "@/components/ui/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import { AreaMap } from "@/components/ui/AreaMap";
import { siteConfig } from "@/data/site";

const fullMapUrl = "https://www.openstreetmap.org/?mlat=48.81213&mlon=3.08438#map=11/48.81213/3.08438";

export function InterventionArea() {
  return <section id="zone-intervention" className="section-space area-section" aria-labelledby="area-title" data-reveal>
    <Container className="area-layout">
      <div className="area-heading">
        <p className="eyebrow">04 / Proches de vous</p>
        <h2 id="area-title">Zone<br /><em>d’intervention.</em></h2>
      </div>

      <figure className="area-map">
        <AreaMap />
        <figcaption className="area-map-caption">
          <span className="area-map-key"><span className="area-dot" aria-hidden="true" />{siteConfig.city} et alentours</span>
          <span className="area-map-key"><span className="area-dot secondary" aria-hidden="true" />{siteConfig.extendedArea} : selon le projet</span>
        </figcaption>
        <a href={fullMapUrl} className="area-map-link" target="_blank" rel="noopener noreferrer">Ouvrir la carte<span className="sr-only"> dans un nouvel onglet</span></a>
      </figure>

      <div className="area-details">
        <p className="eyebrow">Votre secteur</p>
        <h3>À Coulommiers,<br />et <em>autour de vous.</em></h3>
        <p className="area-description">Nous intervenons à Coulommiers et dans les communes alentour. Les projets dans le reste de l’Île-de-France sont étudiés au cas par cas.</p>
        <dl className="area-list">
          <div><dt>{siteConfig.city}</dt><dd>Zone principale</dd></div>
          <div><dt>Ses alentours</dt><dd>Zone principale</dd></div>
          <div><dt>{siteConfig.extendedArea}</dt><dd>{siteConfig.extendedAreaCondition}</dd></div>
        </dl>
        <p className="area-note">Indiquez votre commune et votre projet pour confirmer les possibilités d’intervention.</p>
        <ContactLink className="button button-primary">Envoyer mon adresse</ContactLink>
      </div>
    </Container>
  </section>;
}
