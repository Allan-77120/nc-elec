"use client";

import Image from "next/image";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

const MIN_POSITION = 0;
const MAX_POSITION = 100;
const KEYBOARD_STEP = 2;

export function Realisations() {
  const comparisonRef = useRef<HTMLDivElement>(null);
  const rangeLabelId = useId();

  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const comparison = comparisonRef.current;

    if (!comparison) return;

    const bounds = comparison.getBoundingClientRect();
    const nextPosition = ((clientX - bounds.left) / bounds.width) * 100;
    const clampedPosition = Math.min(
      MAX_POSITION,
      Math.max(MIN_POSITION, nextPosition),
    );

    setPosition(clampedPosition);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    setIsDragging(true);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    updatePosition(event.clientX);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Home") {
      event.preventDefault();
      setPosition(MIN_POSITION);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setPosition(MAX_POSITION);
      return;
    }

    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();

    const direction = event.key === "ArrowRight" ? 1 : -1;

    setPosition((currentPosition) =>
      Math.min(
        MAX_POSITION,
        Math.max(
          MIN_POSITION,
          currentPosition + direction * KEYBOARD_STEP,
        ),
      ),
    );
  };

  return (
    <section
      id="realisations"
      className="bg-white py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-12 max-w-2xl sm:mb-16">
          <span className="mb-4 inline-block text-xl font-semibold uppercase tracking-[0.2em] text-primary-blue">
            Nos réalisations
          </span>

          <h2 className="text-3xl font-medium leading-tight text-dark-navy sm:text-4xl lg:text-5xl">
            Découvrez nos travaux avant et après intervention
          </h2>

          <p className="mt-6 text-base leading-7 text-dark-text/70 sm:text-lg">
            Déplacez le curseur pour comparer l’installation avant les travaux
            et le résultat final.
          </p>
        </div>

        <div
          ref={comparisonRef}
          role="group"
          aria-label="Comparaison avant et après les travaux"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className={`relative mx-auto aspect-[3/4] w-full max-w-2xl touch-none select-none overflow-hidden rounded-2xl bg-neutral-200 shadow-xl ${
            isDragging ? "cursor-grabbing" : "cursor-ew-resize"
          }`}
        >
          <Image
            src="/images/avant.jpeg"
            alt="Installation électrique avant les travaux"
            fill
            priority
            sizes="(min-width: 768px) 672px, 100vw"
            className="pointer-events-none object-contain"
            draggable={false}
          />

          <Image
            src="/images/apres.jpeg"
            alt="Installation électrique après les travaux"
            fill
            priority
            sizes="(min-width: 768px) 672px, 100vw"
            className="pointer-events-none object-contain"
            style={{
              clipPath: `inset(0 0 0 ${position}%)`,
            }}
            draggable={false}
          />

          <span
            className={`pointer-events-none absolute bottom-4 left-4 z-20 rounded bg-dark-navy/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-opacity duration-200 ${
              position >= 18 ? "opacity-100" : "opacity-0"
            }`}
          >
            Avant
          </span>

          <span
            className={`pointer-events-none absolute bottom-4 right-4 z-20 rounded bg-primary-blue px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-opacity duration-200 ${
              position <= 82 ? "opacity-100" : "opacity-0"
            }`}
          >
            Après
          </span>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-electric-yellow"
            style={{ left: `${position}%` }}
          >
            <div
              className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/80 bg-electric-yellow text-dark-navy shadow-lg transition-[scale,box-shadow] duration-200 ${
                isDragging ? "scale-110 shadow-xl" : "scale-100"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m8 7-5 5 5 5" />
                <path d="M3 12h18" />
                <path d="m16 7 5 5-5 5" />
              </svg>
            </div>
          </div>

          <label id={rangeLabelId} className="sr-only">
            Position du curseur de comparaison avant et après
          </label>

          <input
            type="range"
            min={MIN_POSITION}
            max={MAX_POSITION}
            step={1}
            value={position}
            onChange={(event) =>
              setPosition(Number(event.currentTarget.value))
            }
            onKeyDown={handleKeyDown}
            aria-labelledby={rangeLabelId}
            aria-valuetext={`${Math.round(position)} % de l’image avant visible`}
            className="sr-only"
          />
        </div>
      </div>
    </section>
  );
}
