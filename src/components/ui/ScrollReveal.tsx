"use client";

import { useEffect } from "react";

/** Content remains visible without JavaScript or when motion is reduced. */
export function ScrollReveal() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (media.matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.remove("reveal-pending");
          observer.unobserve(target);
        }
      });
    }, { rootMargin: "0px 0px -30px 0px", threshold: 0 });
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("reveal-pending");
        observer.observe(element);
      }
    });
    const revealAll = () => {
      if (media.matches) {
        observer.disconnect();
        elements.forEach((element) => element.classList.remove("reveal-pending"));
      }
    };
    media.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove("reveal-pending"));
      media.removeEventListener("change", revealAll);
    };
  }, []);
  return null;
}
