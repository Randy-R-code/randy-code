"use client";

import { connections, HUB, zones } from "@/lib/data";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function boltPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  idx: number,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const px = -dy / len;
  const py = dx / len;
  const amp = len * 0.04;
  const dir = idx % 2 === 0 ? 1 : -1;
  const w1x = x1 + dx * 0.35 + px * amp * dir;
  const w1y = y1 + dy * 0.35 + py * amp * dir;
  const w2x = x1 + dx * 0.65 + px * amp * -dir;
  const w2y = y1 + dy * 0.65 + py * amp * -dir;
  return `M ${x1} ${y1} L ${w1x.toFixed(1)} ${w1y.toFixed(1)} L ${w2x.toFixed(1)} ${w2y.toFixed(1)} L ${x2} ${y2}`;
}

// Matches MapNode stagger: index * 0.12 + 0.4, duration 0.35
const ENTRY_DELAY = (i: number) => i * 0.12 + 0.4;
const ENTRY_DONE = (connections.length - 1) * 0.12 + 0.4 + 0.35;

export function MapConnections({
  hoveredZone,
}: {
  hoveredZone: string | null;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), ENTRY_DONE * 1000);
    return () => clearTimeout(t);
  }, []);

  const zoneMap = Object.fromEntries(zones.map((z) => [z.id, z]));

  const toPx = (id: string) => {
    const pct = id === "__hub__" ? HUB : zoneMap[id].position;
    return {
      x: (pct.x / 100) * dims!.w,
      y: (pct.y / 100) * dims!.h,
    };
  };

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={dims ? `0 0 ${dims.w} ${dims.h}` : "0 0 0 0"}
      aria-hidden="true"
    >
      {dims &&
        connections.map(([fromId], i) => {
          const from = toPx(fromId);
          const to = toPx("__hub__");
          const hovered = hoveredZone === fromId;
          const color = zoneMap[fromId]?.color ?? "#ffffff";
          const d = boltPath(from.x, from.y, to.x, to.y, i);
          return (
            <motion.path
              key={fromId}
              d={d}
              strokeWidth={hovered ? 0.8 : 0.5}
              fill="none"
              initial={{ opacity: 0, stroke: "#ffffff" }}
              animate={{
                opacity: hovered ? 0.5 : 0.15,
                stroke: hovered ? color : "#ffffff",
              }}
              transition={
                ready
                  ? { duration: 0.2 }
                  : { delay: ENTRY_DELAY(i), duration: 0.35, ease: "easeOut" }
              }
            />
          );
        })}
    </svg>
  );
}
