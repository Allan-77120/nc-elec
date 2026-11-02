"use client";

import type { ReactNode } from "react";

export function ContactLink({ children, className, requestType = "devis", projectType, onClick }: {
  children: ReactNode;
  className?: string;
  requestType?: "devis" | "rendez-vous";
  projectType?: string;
  onClick?: () => void;
}) {
  const query = new URLSearchParams({ demande: requestType });
  if (projectType) query.set("projet", projectType);
  const href = "/?" + query + "#contact";
  return <a href={href} className={className} onClick={(event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(null, "", href);
    window.dispatchEvent(new Event("contact-intent"));
    onClick?.();
    document.getElementById("contact")?.scrollIntoView();
  }}>{children}</a>;
}
