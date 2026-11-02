import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Realisations } from "@/components/sections/Realisations";
import { Contact } from "@/components/sections/Contact";
import { About } from "@/components/sections/About";
import { InterventionArea } from "@/components/sections/InterventionArea";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
export default function Home() {
  return (
    <>
      <Header />
      <ScrollReveal />
      <main id="main" tabIndex={-1}>
      <Hero />
      <Services />
      <Realisations />
      <About />
      <InterventionArea />
      <Contact />
      </main>
    </>
  );
}
