import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page/PageShell";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes from Matthew Oshin on what he is building and learning.",
};

/**
 * /blog - the writing index. Shares the Education depth (zone "writing") and
 * uses the reading width of PageShell so the post list keeps a short measure.
 */
export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <PageShell
      zone="writing"
      navLabel="Writing"
      width="reading"
      heading="Writing"
      intro="Notes on what I am building and what I am learning along the way."
    >
      {posts.length === 0 ? (
        <p className="mt-10 text-ink-muted">First posts coming soon.</p>
      ) : (
        <ul className="mt-10 space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-bio-cyan/30"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="font-serif text-xl font-semibold text-ink-heading transition-colors group-hover:text-bio-cyan sm:text-2xl">
                    {post.title}
                  </h2>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    {post.date}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-body sm:text-base">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
