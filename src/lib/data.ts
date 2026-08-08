import { brand } from "@/lib/brand";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Building2, FlaskConical, User, Wrench } from "lucide-react";

export interface Zone {
  id: string;
  label: string;
  tagline: string;
  route: string;
  Icon: LucideIcon;
  color: string;
  position: { x: number; y: number };
}

// Centre visuel de la map — point de convergence des connexions
export const HUB = { x: 50, y: 48 };

export const zones: Zone[] = [
  {
    id: "tools",
    label: "Tools Station",
    tagline: "Outils utilisables immédiatement",
    route: "/tools",
    Icon: Wrench,
    color: brand.colors.green[500],
    position: { x: 50, y: 12 },
  },
  {
    id: "projects",
    label: "Projects City",
    tagline: "Projets clients & études de cas",
    route: "/projects",
    Icon: Building2,
    color: brand.colors.blue[400],
    position: { x: 80, y: 37 },
  },
  {
    id: "articles",
    label: "Knowledge Base",
    tagline: "Articles, guides & ressources",
    route: "/articles",
    Icon: BookOpen,
    color: brand.colors.blue[400],
    position: { x: 69, y: 77 },
  },
  {
    id: "about",
    label: "About Base",
    tagline: "Parcours, vision & contact",
    route: "/about",
    Icon: User,
    color: brand.colors.blue[400],
    position: { x: 31, y: 77 },
  },
  {
    id: "lab",
    label: "Lab Zone",
    tagline: "IA, prototypes & expérimentations",
    route: "/lab",
    Icon: FlaskConical,
    color: brand.colors.blue[400],
    position: { x: 20, y: 37 },
  },
];

type ZoneId = (typeof zones)[number]["id"];

// Connexions hub-centrique (◎ = HUB)
export const connections: Array<[ZoneId, "__hub__"]> = [
  ["tools", "__hub__"],
  ["projects", "__hub__"],
  ["articles", "__hub__"],
  ["about", "__hub__"],
  ["lab", "__hub__"],
];
