import { ArrowUpRight, Bolt, House, Lightbulb, ShieldCheck, Wrench, Settings } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactLink } from "@/components/ui/ContactLink";

const services = [
  { title: "Installation électrique", type: "Installation électrique", description: "Une installation complète ou partielle, pensée pour vos équipements et les usages de votre logement ou de vos locaux.", icon: Bolt },
  { title: "Dépannage électrique", type: "Dépannage", description: "Recherche de l’origine d’une panne, réparation et remise en service de votre installation électrique.", icon: Wrench },
  { title: "Rénovation électrique", type: "Rénovation", description: "Modernisez votre installation pour l’adapter à vos besoins et améliorer le confort de vos espaces.", icon: House },
  { title: "Mise aux normes", type: "Mise aux normes", description: "Contrôle de l’installation et travaux de mise en conformité pour la sécurité de vos équipements et de leurs utilisateurs.", icon: ShieldCheck },
  { title: "Éclairage", type: "Éclairage", description: "Luminaires, spots et éclairages intérieurs ou extérieurs : des solutions adaptées à chaque pièce et à chaque ambiance.", icon: Lightbulb },
  { title: "Maintenance", type: "Maintenance", description: "Vérification, entretien et remplacement de vos équipements pour préserver le bon fonctionnement de votre installation.", icon: Settings },
];

export function Services() {
  return <section id="services" className="section-space" aria-labelledby="services-title">
    <Container>
      <div className="section-heading">
        <div><p className="eyebrow">Nos services</p><h2 id="services-title">Une solution pour<br className="hidden sm:block" /> chaque projet électrique.</h2></div>
      </div>
      <div className="services-grid">
        {services.map(({ title, description, icon: Icon }, index) => <article className="service-card" key={title}>
          <div className="service-card-top"><span className="service-icon"><Icon size={25} strokeWidth={1.6} aria-hidden="true" /></span><span className="service-number" aria-hidden="true">0{index + 1}</span></div>
          <h3>{title}</h3><p>{description}</p>
        </article>)}
      </div>
      <div className="services-action">
        <ContactLink className="button button-primary">Parlons de votre projet <ArrowUpRight size={18} aria-hidden="true" /></ContactLink>
      </div>
    </Container>
  </section>;
}
