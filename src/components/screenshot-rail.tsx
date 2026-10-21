import Image from "next/image";

export function ScreenshotRail({
  shots,
  label,
  width = 540,
  height = 1050,
}: {
  shots: { src: string; alt: string }[];
  label: string;
  width?: number;
  height?: number;
}) {
  return (
    <ul
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 min-[1072px]:mx-0 min-[1072px]:px-0"
      aria-label={label}
    >
      {shots.map((shot) => (
        <li key={shot.src} className="w-56 shrink-0 snap-start sm:w-64">
          <Image
            src={shot.src}
            alt={shot.alt}
            width={width}
            height={height}
            className="h-auto w-full rounded-2xl border"
            style={{ borderColor: "var(--border-subtle)" }}
          />
        </li>
      ))}
    </ul>
  );
}
