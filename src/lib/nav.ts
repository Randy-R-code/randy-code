export interface NavItem {
  href: string;
  label: string;
}

export const primaryNav: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/projects", label: "Projets" },
  { href: "/tools", label: "Outils" },
  { href: "/articles", label: "Articles" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];
