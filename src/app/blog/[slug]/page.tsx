import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import PageShell from "@/components/page/PageShell";
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

/**
 * /blog/[slug] - one post. Same shell as the index (reading width, Writing
 * label) with a back link above the eyebrow and the date as the kicker.
 */
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
    <PageShell
      zone="writing"
      navLabel="Writing"
      width="reading"
      backLink={{ href: "/blog", label: "Writing" }}
      kicker={post.date}
      heading={post.title}
    >
      <article
        className="prose-ocean measure mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </PageShell>
  );
}
