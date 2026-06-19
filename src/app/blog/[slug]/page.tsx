import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import ZoneSetter from "@/components/page/ZoneSetter";
import { getPost, getPostSlugs } from "@/lib/posts";

// Only serve posts that exist at build time; any other slug 404s (defense in
// depth against path traversal via the route param).
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = marked.parse(post.content) as string;

  return (
    <>
      <ZoneSetter zone="writing" />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-28 pt-28 sm:px-8 sm:pt-32">
        <div className="section-scrim px-6 py-12 sm:px-10 sm:py-14">
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-bio-cyan hover:text-bio-aqua"
          >
            &lt;- Writing
          </Link>

          <p className="mt-7 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            {post.date}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink-heading sm:text-5xl">
            {post.title}
          </h1>

          <article
            className="prose-ocean measure mt-8"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </main>
    </>
  );
}
