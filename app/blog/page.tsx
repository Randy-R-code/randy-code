import { PageShell } from "@/components/layout/page-shell";
import { formatDate, posts } from "@/lib/blog";
import { BookOpen, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Randy World",
  description:
    "Articles sur le développement web, le SEO local et la création de SaaS par Randy Rimbault.",
};

export default function BlogPage() {
  return (
    <PageShell
      label="Knowledge Base"
      title="Articles & ressources"
      tagline="Développement web, SEO local et logique produit — des retours d'expérience concrets."
      color="#f97316"
      icon="bookOpen"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <article
              className="flex h-full flex-col overflow-hidden rounded-xl border transition-shadow duration-300 group-hover:shadow-xl"
              style={{
                borderColor: "#f9731618",
                background: "oklch(0.13 0.012 252)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              {/* Cover image */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-800">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: "oklch(0.11 0.01 252)" }}
                  >
                    <BookOpen
                      size={32}
                      style={{ color: "#f97316" }}
                      className="opacity-30"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: "#f9731615", color: "#f97316" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-sm font-semibold leading-snug text-white transition-colors group-hover:text-orange-300">
                  {post.title}
                </h2>

                <p className="flex-1 text-xs leading-relaxed text-zinc-500">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-[11px] text-zinc-600">
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {post.readingTime} min
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
