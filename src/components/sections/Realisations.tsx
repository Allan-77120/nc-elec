"use client";

import Image from "next/image";
import { useId, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

const projects = [
  { category: "Nos réalisations", title: "Rénovation d’un tableau électrique", description: "Reprise du câblage et réorganisation du tableau électrique. Vue après intervention, avant la pose du capot.", before: "/images/avant.jpeg", after: "/images/apres.jpeg", beforeAlt: "Tableau électrique avant la reprise du câblage", afterAlt: "Tableau électrique réorganisé et recâblé, avant la pose du capot" },
  { category: "Nos réalisations", title: "Remplacement d’un coffret électrique", description: "Remplacement de l’ancien équipement par un nouveau coffret et ses protections électriques.", before: "/images/tableau-02-avant.png", after: "/images/tableau-02-apres.png", beforeAlt: "Ancien coffret électrique et câblage apparent avant intervention", afterAlt: "Nouveau coffret électrique équipé de ses protections" },
];

export function Realisations() {
  const [current, setCurrent] = useState(0);
  const carouselId = useId();
  const changeProject = () => setCurrent((index) => (index + 1) % projects.length);

  return <section id="realisations" className="section-space realisations-section" aria-labelledby="realisations-title" data-reveal>
    <Container className="realisations-layout">
      <div className="realisations-heading">
        <p className="eyebrow">02 / Nos réalisations</p>
        <h2 id="realisations-title">Voir ce qui change,<br /><em>avant de décider.</em></h2>
      </div>
      <div className="project-carousel" role="region" aria-roledescription="carrousel" aria-labelledby="realisations-title">
        <div className="project-card">
          <div className="comparison-project-heading">
            <p className="project-category">{projects[current].category} · {String(current + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
            <h3>{projects[current].title}</h3>
            <p>{projects[current].description}</p>
            <button type="button" className="other-project" aria-controls={carouselId} onClick={changeProject}>Voir l’autre réalisation</button>
          </div>
        <div id={carouselId} className="carousel-slides">
          {projects.map((project, index) => <div key={project.before} className="carousel-slide" role="group" aria-roledescription="diapositive" aria-label={(index + 1) + " sur " + projects.length + " : " + project.title} hidden={index !== current}>
            <ImageComparison {...project} />
          </div>)}
        </div>
        </div>
        <p className="sr-only" role="status" aria-atomic="true">Réalisation {String(current + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} — {projects[current].title}</p>
        <p id="comparison-instructions" className="sr-only">Au clavier : flèches gauche et droite, Début et Fin.</p>
      </div>
    </Container>
  </section>;
}

function ImageComparison({ title, before, after, beforeAlt, afterAlt }: {
  title: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef<{ pointerId: number; x: number; position: number; width: number } | null>(null);
  const range = useRef<HTMLInputElement>(null);
  const id = useId();
  const end = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <figure className="comparison-figure" aria-label={title + " : comparaison avant et après"}>
        <div className={"comparison-image" + (isDragging ? " is-dragging" : "")} role="group" aria-label={title + " : photos avant et après les travaux"}
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            drag.current = { pointerId: event.pointerId, x: event.clientX, position, width: event.currentTarget.getBoundingClientRect().width };
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
            range.current?.focus({ preventScroll: true });
          }}
          onPointerMove={(event) => {
            if (drag.current?.pointerId !== event.pointerId) return;
            const next = drag.current.position + (event.clientX - drag.current.x) / drag.current.width * 100;
            setPosition(Math.min(100, Math.max(0, next)));
          }}
          onPointerUp={end} onPointerCancel={end} onLostPointerCapture={() => { drag.current = null; setIsDragging(false); }}>
          <Image src={before} alt={beforeAlt} fill sizes="(min-width: 768px) 420px, (min-width: 520px) 460px, 90vw" className="pointer-events-none object-contain" draggable={false} />
          <Image src={after} alt={afterAlt} fill sizes="(min-width: 768px) 420px, (min-width: 520px) 460px, 90vw" className="pointer-events-none object-contain" style={{ clipPath: "inset(0 0 0 " + position + "%)" }} draggable={false} />
          <span className="comparison-label before" style={{ opacity: position > 15 ? 1 : 0 }}>Avant</span>
          <span className="comparison-label after" style={{ opacity: position < 85 ? 1 : 0 }}>Après</span>
          <span className="comparison-divider" style={{ left: position + "%" }} aria-hidden="true" />
          <span className="comparison-handle" style={{ left: "clamp(24px, " + position + "%, calc(100% - 24px))" }} aria-hidden="true">
            <ChevronLeft size={18} /><ChevronRight size={18} />
          </span>
        </div>
        <figcaption className="comparison-controls">
          <label htmlFor={id}>Avant</label>
          <input ref={range} id={id} type="range" min={0} max={100} step={1} value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label={title + " : part de la photo avant visible"} aria-describedby="comparison-instructions" aria-valuetext={Math.round(position) + " % avant, " + Math.round(100 - position) + " % après"} />
          <span>Après</span>
        </figcaption>
      </figure>;
}
