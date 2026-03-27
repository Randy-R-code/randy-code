"use client";

import type { Zone } from "@/lib/data";
import { motion } from "framer-motion";
import Link from "next/link";

interface MapNodeProps extends Zone {
  index: number;
  onHover: (id: string | null) => void;
}

export function MapNode({
  id,
  label,
  tagline,
  route,
  Icon,
  color,
  position,
  index,
  onHover,
}: MapNodeProps) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.12 + 0.4,
        duration: 0.35,
        ease: "easeOut",
      }}
    >
      <Link href={route}>
        <motion.div
          className="relative w-40 cursor-pointer rounded-xl border p-4"
          style={{
            background: "oklch(0.13 0.012 252)",
            borderColor: `${color}30`,
          }}
          whileHover={{
            scale: 1.06,
            borderColor: `${color}90`,
            boxShadow: `0 0 24px ${color}30`,
          }}
          transition={{ duration: 0.18 }}
          onHoverStart={() => onHover(id)}
          onHoverEnd={() => onHover(null)}
        >
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon size={13} style={{ color }} />
              </div>
              <span className="text-xs font-semibold leading-tight text-white">
                {label}
              </span>
            </div>

            <p className="text-[11px] leading-snug text-zinc-500">{tagline}</p>

            <div
              className="flex items-center gap-1 text-[10px] font-medium"
              style={{ color }}
            >
              Explorer <span className="text-[9px]">→</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
