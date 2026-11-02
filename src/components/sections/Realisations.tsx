"use client";

import Image from "next/image";
import { useId, useRef, useState, type PointerEvent } from "react";
import { MoveHorizontal } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Realisations() {
  return <section id="realisations" className="section-space realisations-section" aria-labelledby="realisations-title">
    <Container>
      <div className="realisations-heading">
        <p className="eyebrow">Nos réalisations</p>
        <h2 id="realisations-title">Deux tableaux différents,<br />le changement en images.</h2>
        <p className="section-intro">Découvrez deux rénovations de tableaux électriques. Chaque comparateur présente un tableau différent, avant et après les travaux. Faites glisser les séparations pour observer chaque intervention.</p>
      </div>
      <div className="comparison-layout">
        <ImageComparison title="Tableau électrique n° 1" description="L’ancien équipement et le tableau après recâblage, avant la pose du capot." before="/images/avant.jpeg" after="/images/apres.jpeg" beforeAlt="Premier tableau électrique avant rénovation" afterAlt="Premier tableau après recâblage, avant la pose du capot" />
        <ImageComparison title="Tableau électrique n° 2" description="Un autre tableau électrique, avant les travaux puis équipé de son nouveau coffret." before="/images/tableau-02-avant.png" after="/images/tableau-02-apres.png" beforeAlt="Deuxième tableau électrique avec son ancien équipement et câblage apparent" afterAlt="Deuxième tableau rénové avec son nouveau coffret et ses protections" />
      </div>
      <p id="comparison-instructions" className="comparison-instructions"><MoveHorizontal size={18} aria-hidden="true" /> Faites glisser vers la droite ou la gauche pour comparer l’avant et l’après.</p>
    </Container>
  </section>;
}

function ImageComparison({ title, description, before, after, beforeAlt, afterAlt }: {
  title: string;
  description: string;
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
  const chevronGradientId = id + "-chevron-gradient";
  const end = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <figure className="comparison-figure" aria-labelledby={id + "-title"}>
        <div className="comparison-project-heading">
          <h3 id={id + "-title"}>{title}</h3>
          <p>{description}</p>
        </div>
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
          <Image src={before} alt={beforeAlt} fill sizes="(min-width: 1320px) 604px, (min-width: 768px) 46vw, 92vw" className="pointer-events-none object-contain" draggable={false} />
          <Image src={after} alt={afterAlt} fill sizes="(min-width: 1320px) 604px, (min-width: 768px) 46vw, 92vw" className="pointer-events-none object-contain" style={{ clipPath: "inset(0 0 0 " + position + "%)" }} draggable={false} />
          <span className="comparison-label before" style={{ opacity: position > 15 ? 1 : 0 }}>Avant</span>
          <span className="comparison-label after" style={{ opacity: position < 85 ? 1 : 0 }}>Après</span>
          <span className="comparison-divider" style={{ left: position + "%" }} aria-hidden="true" />
          <span className="comparison-handle" style={{ left: "clamp(24px, " + position + "%, calc(100% - 24px))" }} aria-hidden="true">
            <svg width="36" height="20" viewBox="0 0 36 20" fill="none">
              <defs>
                <linearGradient id={chevronGradientId} x1="6" y1="10" x2="30" y2="10" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--color-primary-blue)" />
                  <stop offset="1" stopColor="var(--color-electric-yellow)" />
                </linearGradient>
              </defs>
              <path d="m12 4-6 6 6 6m12-12 6 6-6 6" stroke={"url(#" + chevronGradientId + ")"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <figcaption className="comparison-controls sr-only">
          <input ref={range} id={id} type="range" min={0} max={100} step={1} value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label={title + " : part de la photo avant visible"} aria-describedby="comparison-instructions" aria-valuetext={Math.round(position) + " % avant, " + Math.round(100 - position) + " % après"} />
        </figcaption>
      </figure>;
}
