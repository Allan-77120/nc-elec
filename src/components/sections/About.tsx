import { ArrowUpRight, MapPin, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactLink } from "@/components/ui/ContactLink";
import { siteConfig } from "@/data/site";

export function About() {
  return <>
    <section id="a-propos" className="section-space about-section" aria-labelledby="about-title">
      <Container className="about-grid">
        <div><p className="eyebrow">À propos de NC’ELEC</p><h2 id="about-title">Votre projet commence<br />par un échange.</h2></div>
        <div className="about-copy"><p>NC’ELEC est une entreprise d’électricité générale en {siteConfig.region}. Installation, dépannage, rénovation ou éclairage : nous vous accompagnons dans les besoins électriques de votre logement et de vos locaux professionnels.</p><p>Décrivez votre situation, les travaux envisagés et vos contraintes. Cet échange permet de préciser votre besoin et de préparer la suite de votre projet.</p><ContactLink requestType="rendez-vous" className="text-link">Échangeons sur votre projet <ArrowUpRight size={18} aria-hidden="true" /></ContactLink><span className="about-location"><MapPin size={18} aria-hidden="true" /> {siteConfig.region}</span></div>
      </Container>
    </section>
    <section id="avis" className="reviews-section" aria-labelledby="reviews-title">
      <Container className="reviews-inner">
        <span className="review-icon"><MessageSquare size={30} strokeWidth={1.5} aria-hidden="true" /></span>
        <div><p className="eyebrow">Vos retours</p><h2 id="reviews-title">Votre expérience compte.</h2><p>Vous avez fait appel à NC’ELEC ? Partagez votre retour avec nous.</p></div>
        <a className="button button-white" href={"mailto:" + siteConfig.email + "?subject=Mon%20retour%20sur%20NC%E2%80%99ELEC"}>Partager mon avis <ArrowUpRight size={18} aria-hidden="true" /></a>
      </Container>
    </section>
  </>;
}
