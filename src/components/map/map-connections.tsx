"use client";

import { connections, HUB, zones } from "@/lib/data";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function MapConnections() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 1200, h: 680 });

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const zoneMap = Object.fromEntries(zones.map((z) => [z.id, z]));

  const px = (id: string) => {
    const pct = id === "__hub__" ? HUB : zoneMap[id].position;
    return { x: (pct.x / 100) * dims.w, y: (pct.y / 100) * dims.h };
  };

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      aria-hidden="true"
    >
      {connections.map(([fromId, toId], i) => {
        const from = px(fromId);
        const to = px(toId);
        return (
          <motion.line
            key={`${fromId}-${toId}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#22d3ee"
            strokeWidth="1"
            strokeOpacity="0.25"
            strokeDasharray="4 6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.12 + 0.4 }}
          />
        );
      })}
    </svg>
  );
}
