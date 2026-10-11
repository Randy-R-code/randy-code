import { renderToolOgImage } from "@/components/og/tool-og-image";
import { brand } from "@/lib/brand";
import { getGame } from "@/lib/games";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "As It Should Be — Randy Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Raw node data from lucide-react's gamepad-2 icon
// (dist/esm/icons/gamepad-2.mjs), with Lucide's internal `key` field dropped.
const GAMEPAD_ICON = [
  ["line", { x1: "6", x2: "10", y1: "11", y2: "11" }],
  ["line", { x1: "8", x2: "8", y1: "9", y2: "13" }],
  ["line", { x1: "15", x2: "15.01", y1: "12", y2: "12" }],
  ["line", { x1: "18", x2: "18.01", y1: "10", y2: "10" }],
  [
    "path",
    {
      d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
    },
  ],
] as const;

const PANEL_WIDTH = 440;
const BANNER_WIDTH = PANEL_WIDTH - 56;

export default async function Image() {
  const game = getGame("as-it-should-be");
  if (!game) throw new Error("Game not found");

  const banner = await readFile(join(process.cwd(), "public", game.banner.src));
  const bannerHeight = Math.round(
    (BANNER_WIDTH * game.banner.height) / game.banner.width,
  );

  const preview = (
    <div
      style={{
        display: "flex",
        width: BANNER_WIDTH,
        height: bannerHeight,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <img
        src={`data:image/jpeg;base64,${banner.toString("base64")}`}
        width={BANNER_WIDTH}
        height={bannerHeight}
        alt=""
      />
    </div>
  );

  return renderToolOgImage({
    title: game.name,
    tagline: game.tagline.fr,
    color: brand.colors.violet[400],
    iconNodes: GAMEPAD_ICON,
    label: "Games Arcade",
    preview,
    previewWidth: PANEL_WIDTH,
  });
}
