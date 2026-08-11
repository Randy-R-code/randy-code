import Link from "next/link";

// Replaces a per-page "← Back to home" link (was duplicated identically
// across docs/privacy/compare) with lateral navigation between InfraLens's
// own subsections. Privacy is intentionally not a nav item — it doesn't
// need to be a primary tab (migration finalization doc §5).
const LOCAL_NAV_LINKS = [
  { href: "/tools/infralens", label: "Analyze" },
  { href: "/tools/infralens/compare", label: "Compare" },
  { href: "/tools/infralens/docs", label: "Documentation" },
];

export function LocalNav() {
  return (
    <nav
      aria-label="InfraLens sections"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
    >
      {LOCAL_NAV_LINKS.map((link, i) => (
        <span key={link.href} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true">·</span>}
          <Link
            href={link.href}
            className="hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
