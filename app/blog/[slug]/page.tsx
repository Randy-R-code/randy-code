import { formatDate, getPost, posts } from "@/lib/blog";
import { ArrowLeft, Clock, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Randy World`,
    description: post.description,
  };
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Randy Rimbault",
      url: "https://randy-code.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Randy Rimbault",
      url: "https://randy-code.dev",
    },
    url: `https://randy-code.dev/blog/${post.slug}`,
  };

  return (
    <main className="min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Hero image + overlay */}
      <div className="relative h-72 w-full overflow-hidden md:h-96">
        {/* Grid pattern background */}
        <div
          className="absolute inset-0"
          style={{
            background: "oklch(0.085 0 0)",
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 3%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 3%) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        )}

        {/* Gradient overlay + title */}
        <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/30 to-transparent px-6 pb-8">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                  style={{ backgroundColor: "#f9731620", color: "#f97316" }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold leading-tight text-white drop-shadow-lg md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-400 drop-shadow">
              Publié le {formatDate(post.date)} ·{" "}
              <span className="inline-flex items-center gap-1">
                <Clock size={11} />
                {post.readingTime} min de lecture
              </span>{" "}
              · par Randy Rimbault
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 pt-10">
        {/* Back nav */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <ArrowLeft size={12} />
          Tous les articles
        </Link>

        {/* Prose */}
        <div
          className="prose-blog mt-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer CTAs */}
        <div
          className="mt-16 rounded-xl border p-6"
          style={{
            borderColor: "#f9731620",
            background: "oklch(0.13 0.012 252)",
          }}
        >
          <p className="mb-4 text-sm font-semibold text-white">
            Mes projets en cours
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://liflow.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "#8b5cf618",
                color: "#8b5cf6",
                border: "1px solid #8b5cf630",
              }}
            >
              Découvrir Liflow <ExternalLink size={12} />
            </a>
            <a
              href="https://infralens.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "#22d3ee18",
                color: "#22d3ee",
                border: "1px solid #22d3ee30",
              }}
            >
              Découvrir InfraLens <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
