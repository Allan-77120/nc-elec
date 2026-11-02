"use client";

import { useEffect, useRef, useState } from "react";
import type { Map } from "leaflet";

export function AreaMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let started = false;
    let map: Map | undefined;
    let resize: ResizeObserver | undefined;
    let resizeFrame = 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      if (!map) return;
      map.options.zoomAnimation = !motion.matches;
      map.options.fadeAnimation = !motion.matches;
      map.options.markerZoomAnimation = !motion.matches;
    };

    const start = async () => {
      if (started || cancelled) return;
      started = true;
      try {
        const L = await import("leaflet");
        if (cancelled) return;
        map = L.map(container, {
          scrollWheelZoom: false,
          // A one-finger gesture keeps scrolling the page on mobile; pinch and +/- zoom the map.
          dragging: !L.Browser.mobile,
          zoomControl: false,
          zoomAnimation: !motion.matches,
          fadeAnimation: !motion.matches,
          markerZoomAnimation: !motion.matches,
        }).setView([48.81213, 3.08438], 10);

        L.control.zoom({ position: "topleft", zoomInTitle: "Agrandir la carte", zoomOutTitle: "Réduire la carte" }).addTo(map);
        map.attributionControl.setPrefix(false);
        const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">Contributeurs OpenStreetMap</a>',
        });
        tiles.on("tileload", () => { if (!cancelled) setStatus("ready"); });
        tiles.on("tileerror", () => { if (!cancelled && container.querySelectorAll("img.leaflet-tile-loaded").length === 0) setStatus("error"); });
        tiles.addTo(map);

        // A town-centre marker does not imply a business address or a service radius.
        L.marker([48.81213, 3.08438], {
          icon: L.divIcon({ className: "area-city-marker", html: '<span aria-hidden="true"></span>', iconSize: [28, 28], iconAnchor: [14, 14] }),
          title: "Centre de Coulommiers",
          alt: "Centre de Coulommiers",
        }).bindTooltip("Coulommiers", { permanent: true, direction: "bottom", offset: [0, 15], className: "area-city-label" }).addTo(map);

        resize = new ResizeObserver(() => {
          cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(() => {
            // Recompute the tile coverage after layout, preserving the geographic centre.
            if (!cancelled) map?.invalidateSize({ animate: false, pan: true });
          });
        });
        resize.observe(container);
        motion.addEventListener("change", updateMotion);
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        void start();
      }
    }, { rootMargin: "250px" });
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
      resize?.disconnect();
      cancelAnimationFrame(resizeFrame);
      motion.removeEventListener("change", updateMotion);
      map?.remove();
    };
  }, []);

  return <>
    <div ref={containerRef} className="area-map-canvas" role="region" aria-label="Carte interactive de Coulommiers et de ses alentours" />
    {status !== "ready" && <p className="area-map-notice" role="status">{status === "loading" ? "Chargement de la carte…" : "Le fond de carte est indisponible. Utilisez le lien « Ouvrir la carte »."}</p>}
  </>;
}
