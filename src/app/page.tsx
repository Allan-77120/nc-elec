import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Realisations } from "@/components/sections/Realisations";
import { Contact } from "@/components/sections/Contact";
export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Realisations />
      <Contact />
    </>
  );
}
