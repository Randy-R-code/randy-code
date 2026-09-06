import { GitHubIcon } from "@/components/github-icon";
import { formatDate, getPost, posts } from "@/lib/blog";
import { brand } from "@/lib/brand";
import { buildArticleSchema } from "@/lib/json-ld";
import { openSourceProjects } from "@/lib/open-source";
import { getFeaturedProjects } from "@/lib/projects";
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
    title: `${post.title} — Randy Code`,
    description: post.description,
    alternates: { canonical: `/articles/${post.slug}` },
  };
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const featuredProjects = getFeaturedProjects();

  return (
    <main className="flex-1 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildArticleSchema(post)),
        }}
      />
      {/* Hero image + overlay */}
      <div className="relative h-72 w-full overflow-hidden md:h-96">
        {/* Grid pattern background */}
        <div
          className="absolute inset-0"
          style={{
            background: brand.colors.background,
            backgroundImage:
              "linear-gradient(rgba(100, 160, 220, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 160, 220, 0.035) 1px, transparent 1px)",
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
                  style={{
                    backgroundColor: `${brand.colors.blue[400]}18`,
                    color: brand.colors.blue[400],
                  }}
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
        {/* Breadcrumbs */}
        <nav
          aria-label="Fil d'Ariane"
          className="mb-4 flex items-center gap-1.5 text-xs text-zinc-400"
        >
          <Link href="/" className="hover:text-zinc-300">
            Accueil
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/articles" className="hover:text-zinc-300">
            Articles
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-zinc-400">
            {post.title}
          </span>
        </nav>

        {/* Back nav */}
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
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
            borderColor: `${brand.colors.blue[400]}30`,
            background: brand.colors.surface[2],
          }}
        >
          <p className="mb-4 text-sm font-semibold text-white">Mes projets</p>
          <div className="flex flex-wrap gap-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "#ffffff0d",
                  color: "#ffffff",
                  border: "1px solid #ffffff18",
                }}
              >
                Découvrir {project.name} →
              </Link>
            ))}
            {openSourceProjects.map((project) => (
              <a
                key={project.name}
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir ${project.name} sur GitHub`}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "#ffffff0d",
                  color: "#ffffff",
                  border: "1px solid #ffffff18",
                }}
              >
                <GitHubIcon size={13} />
                {project.name}
                <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
