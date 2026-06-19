import type { Metadata } from "next";
import Link from "next/link";
import ZoneSetter from "@/components/page/ZoneSetter";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes from Matthew Oshin on what he is building and learning.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <ZoneSetter zone="writing" />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-28 pt-28 sm:px-8 sm:pt-32">
        <div className="section-scrim px-6 py-12 sm:px-10 sm:py-14">
          <p className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-muted">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-reef-coral shadow-[0_0_8px_color-mix(in_srgb,var(--reef-coral)_55%,transparent)]"
            />
            <span className="text-reef-coral">Abyss</span>
            <span aria-hidden="true" className="text-ink-faint">
              /
            </span>
            <span>Writing</span>
          </p>

          <h1 className="font-display text-4xl font-semibold leading-tight text-ink-heading sm:text-6xl">
            Writing
          </h1>
          <p className="measure mt-4 text-base text-ink-muted sm:text-lg">
            Notes on what I am building and what I am learning along the way.
          </p>

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
                      <h2 className="font-display text-xl font-semibold text-ink-heading transition-colors group-hover:text-bio-cyan sm:text-2xl">
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
        </div>
      </main>
    </>
  );
}
