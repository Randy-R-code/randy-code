"use client";

import { HUB, zones } from "@/lib/data";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapConnections } from "./map-connections";
import { MapNode } from "./map-node";

export function WorldMap() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <>
      {/* Desktop: interactive map */}
      <div
        className="relative hidden flex-1 md:block"
        style={{ minHeight: "68vh" }}
      >
        <MapConnections hoveredZone={hoveredZone} />

        {/* Hub central — crosshair */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="relative flex h-4 w-4 items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white/80" />
            <div className="absolute h-4 w-4 rounded-full bg-white/10 blur-sm" />
          </div>
        </motion.div>

        {zones.map((zone, index) => (
          <MapNode
            key={zone.id}
            {...zone}
            index={index}
            onHover={setHoveredZone}
          />
        ))}
      </div>

      {/* Mobile: vertical list */}
      <div className="flex flex-col gap-3 md:hidden">
        {zones.map((zone) => (
          <a
            key={zone.id}
            href={zone.route}
            className="flex items-center gap-4 rounded-xl border p-4 transition-colors"
            style={{
              borderColor: `${zone.color}25`,
              background: "oklch(0.13 0.012 252)",
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${zone.color}18` }}
            >
              <zone.Icon size={16} style={{ color: zone.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{zone.label}</p>
              <p className="text-xs text-zinc-500">{zone.tagline}</p>
            </div>
            <span className="ml-auto text-xs" style={{ color: zone.color }}>
              →
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
