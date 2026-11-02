export type NavigationLink = {
  label: string;
  href: `#${string}`;
  icon: "home" | "bolt" | "grid" | "route" | "map" | "message";
};

export const navigationGroups: { label: string; links: NavigationLink[] }[] = [
  {
    label: "Découvrir",
    links: [
      { label: "Accueil", href: "#accueil", icon: "home" },
      { label: "Savoir-faire", href: "#services", icon: "bolt" },
      { label: "Réalisations", href: "#realisations", icon: "grid" },
      { label: "Notre démarche", href: "#a-propos", icon: "route" },
    ],
  },
  {
    label: "Votre projet",
    links: [
      { label: "Zone d’intervention", href: "#zone-intervention", icon: "map" },
      { label: "Nous contacter", href: "#contact", icon: "message" },
    ],
  },
];

export const navigation = navigationGroups.flatMap(group => group.links);
