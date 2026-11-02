import { Container } from "@/components/ui/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import { siteConfig } from "@/data/site";

export function About() {
  return <section id="a-propos" className="section-space about-section" aria-labelledby="about-title" data-reveal>
      <Container className="about-grid">
        <div><p className="eyebrow">03 / Notre démarche</p><h2 id="about-title">Votre projet commence<br />par <em>un échange.</em></h2></div>
        <div className="about-copy"><p>NC’ELEC est une entreprise d’électricité générale en {siteConfig.region}. Installation, dépannage, rénovation ou éclairage : nous vous accompagnons dans les besoins électriques de votre logement et de vos locaux professionnels.</p><p>Décrivez votre situation, les travaux envisagés et vos contraintes. Cet échange permet de préciser votre besoin et de préparer la suite de votre projet.</p><ContactLink requestType="rendez-vous" className="text-link">Échangeons sur votre projet</ContactLink></div>
        <ol className="method-steps">
          <li><span aria-hidden="true">01</span><h3>Votre besoin</h3><p>Une installation, une panne, une rénovation : dites-nous ce que vous avez en tête.</p></li>
          <li><span aria-hidden="true">02</span><h3>Votre contexte</h3><p>Le lieu, les équipements et vos contraintes pour préciser ensemble le projet.</p></li>
          <li><span aria-hidden="true">03</span><h3>La suite, ensemble</h3><p>Une demande de devis ou un échange pour préparer l’intervention adaptée.</p></li>
        </ol>
      </Container>
    </section>;
}
