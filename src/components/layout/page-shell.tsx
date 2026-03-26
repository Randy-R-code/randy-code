"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  FlaskConical,
  Globe,
  HardHat,
  Rocket,
  User,
} from "lucide-react";
import Link from "next/link";

const iconMap = {
  building2: Building2,
  rocket: Rocket,
  globe: Globe,
  flask: FlaskConical,
  user: User,
  bookOpen: BookOpen,
  hardHat: HardHat,
} as const;

export type PageIcon = keyof typeof iconMap;

interface PageShellProps {
  label: string;
  title: string;
  tagline: string;
  color: string;
  icon: PageIcon;
  children: React.ReactNode;
}

export function PageShell({
  label,
  title,
  tagline,
  color,
  icon,
  children,
}: PageShellProps) {
  const Icon = iconMap[icon];

  return (
    <main className="min-h-screen px-6 pt-8 pb-16">
      <div className="mx-auto w-full max-w-5xl">
        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft size={12} />
            Randy World
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          className="mt-8 mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <div className="mb-3 flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon size={15} style={{ color }} />
            </div>
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color }}
            >
              {label}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-base text-zinc-400">{tagline}</p>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}
