import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Realisations } from "@/components/sections/Realisations";
import { Contact } from "@/components/sections/Contact";
import { About } from "@/components/sections/About";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
      <Hero />
      <Services />
      <Realisations />
      <About />
      <Contact />
      </main>
      <footer className="site-footer">
        <Container className="footer-inner">
          <a href="#accueil" className="footer-brand" aria-label="NC’ELEC — Retour à l’accueil">
            <span className="brand-crop">
              <Image src="/logo/ncelec.png" alt="NC’ELEC" width={176} height={176} className="brand-image" />
            </span>
          </a>
          <p>{siteConfig.region}</p>
          <a href="tel:+33684828065">{siteConfig.phone}</a>
          <a href="#contact">Nous contacter ↗</a>
        </Container>
      </footer>
    </>
  );
}
