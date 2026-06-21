import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXPERIENCE } from "@/data/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return EXPERIENCE.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const job = EXPERIENCE.find((j) => j.slug === slug);
  if (!job) return { title: "Role not found" };
  return {
    title: `${job.role} at ${job.org}`,
    description: job.points[0] as string,
  };
}

export default async function RolePage({
  params,
}: { params: Params }) {
  const { slug } = await params;
  const job = EXPERIENCE.find((j) => j.slug === slug);
  if (!job) notFound();

  const context = ROLE_CONTEXT[slug];

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, var(--deep-top), var(--abyss-body) 55%, var(--abyss-void))",
        }}
      />

      <main className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <Link
          href="/#about"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-bio-cyan hover:underline"
        >
          <span aria-hidden="true">&lt;-</span> Back to experience
        </Link>

        <header className="mt-8">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            {job.period}
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink-heading sm:text-6xl">
            {job.role}
          </h1>
          <p className="mt-2 font-display text-xl text-bio-cyan sm:text-2xl">
            {job.org}
          </p>
        </header>

        {(context?.storyParagraphs || context?.overview) && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
              Overview
            </h2>
            {context?.storyParagraphs ? (
              <div className="measure mt-4 space-y-4 text-base leading-relaxed text-ink-body sm:text-lg">
                {context.storyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <p className="measure mt-4 text-base leading-relaxed text-ink-body sm:text-lg">
                {context.overview}
              </p>
            )}
          </section>
        )}

        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
            What I did
          </h2>
          <ul className="mt-4 space-y-4">
            {job.points.map((point) => (
              <li key={point} className="flex gap-4 text-base text-ink-body">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bio-cyan/70" />
                {point}
              </li>
            ))}
          </ul>
        </section>

        {context?.highlights && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
              Highlights
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {context.highlights.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold text-ink-heading">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {context?.lessons && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-bio-cyan/80">
              What I took from it
            </h2>
            <ul className="mt-4 space-y-4">
              {context.lessons.map((lesson) => (
                <li key={lesson} className="flex gap-4 text-base text-ink-body">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-reef-coral/70" />
                  {lesson}
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-16 border-t border-white/10 pt-8">
          <Link
            href="/#contact"
            className="font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-bio-cyan"
          >
            Want to talk about this? Surface a signal -&gt;
          </Link>
        </footer>
      </main>
    </div>
  );
}

interface RoleContext {
  overview?: string;
  storyParagraphs?: readonly string[];
  highlights?: { label: string; value: string }[];
  lessons?: string[];
}

const ROLE_CONTEXT: Record<string, RoleContext> = {
  brachyclip: {
    overview:
      "BrachyClip is an early-stage medical device company affiliated with Brown University and Rhode Island Hospital, building a clip-based brachytherapy seed delivery system for minimally invasive cancer surgery. I came in as CAIO and Director of Marketing to build the brand, go-to-market, and investor narrative from zero, for a device that hasn't yet cleared the FDA.",
    storyParagraphs: [
      "BrachyClip is an early-stage medical device company affiliated with Brown University and Rhode Island Hospital, built by radiation-oncology faculty who invented the underlying technology. It is developing a clip-based applicator for intraoperative permanent seed brachytherapy: a handheld device that places radioactive seeds, encased in titanium clips, directly against residual tumor tissue during minimally invasive cancer surgery.",
      "The clinical problem is specific. When a surgeon leaves a positive or close margin, the risk of local recurrence climbs, and that happens in roughly 170,000 cases a year in the U.S. across chest, abdominal, pelvic, and extremity sites. Permanent seed brachytherapy is an effective, decades-old answer, but older delivery methods risk seed migration and uneven dose in laparoscopic and robotic workflows. The clip applicator is designed to fit standard trocars, carry a magazine of seeds, and place them securely with tactile feedback.",
      "I came in as Chief AI Officer and Director of Marketing to build the brand, the go-to-market, and the investor narrative from zero, for a device that has not yet cleared the FDA. That means selling the team, the science, and the process rather than a product you can ship today, with FDA-compliant content as a hard constraint rather than an afterthought.",
      "I also drive AI integration into the clinical and operational workflows behind the company and support investor relations directly. It runs on a different clock than a software startup: the work rewards precision and credibility over speed, and at this stage the narrative is the product.",
    ],
    highlights: [
      { label: "TAM", value: "$6.8B" },
      { label: "Predicate pathway", value: "510(k)" },
      { label: "Tumor categories", value: "9" },
    ],
    lessons: [
      "FDA-compliant content strategy is a real constraint that forces cleaner, more honest marketing. You can't claim outcomes you haven't proven.",
      "Building a brand for a pre-clearance device means selling the team, the science, and the process, not the product. The investor narrative is the product at this stage.",
      "Medical device companies move on clinical timelines, not startup timelines. The work is about precision and credibility, not speed.",
    ],
  },
  icr: {
    overview:
      "ICR is a leading investor-relations and strategic-communications firm. I joined to stand up the firm's AI function from scratch, build the internal AI platform, and drive adoption across a firm of 200-plus people who had never used these tools in a professional workflow before. I built most of it solo on Claude Code and reported into the AI Council and firm leadership.",
    highlights: [
      { label: "Firm headcount", value: "200+" },
      { label: "Platform surfaces built", value: "6+" },
      { label: "Tech stack", value: "Next.js, Supabase, Vercel" },
    ],
    lessons: [
      "Adoption is harder than the build. Shipping the platform was 20% of the job. Getting senior advisors to use AI in their daily workflow took real investment in training, embedding, and making the tools feel safe to try.",
      "Distribution beats production here too. An AI tool that sits in a sidebar and gets ignored is worth nothing. The value unlocked is the value that actually flows through people's hands.",
      "Owning the data pipeline from day one is non-negotiable. The labeling loop and the RAG layer over firm work product were the foundation the whole platform sat on.",
    ],
  },
  "manatuck-hill": {
    overview:
      "Manatuck Hill Partners is a Connecticut-based hedge fund. I spent 2024 in an equity research role running the classic buy-side loop: generate an edge, pressure-test it, size it with conviction. The firm gave me real coverage responsibility and exposure to how investment professionals think through thematic bets under uncertainty.",
    highlights: [
      { label: "Coverage themes", value: "AI, nuclear, precious metals" },
      { label: "Role type", value: "Equity research" },
      { label: "Location", value: "Connecticut" },
    ],
    lessons: [
      "Edge is a process, not a fact. The real skill is knowing when your view is differentiated from consensus and being able to quantify how much it matters.",
      "Management interviews are a distinct skill. Knowing what to listen for and what to push on in a call with a CEO is something you only develop by doing it repeatedly.",
      "Markets teach you that being right is less important than being right for the right reasons, and calibrated over time. That insight shaped how I built Sigma.",
    ],
  },
  qult: {
    overview:
      "Qult.ai was an early-stage AI startup in the healthcare-career space. As AI PM, I led a four-person engineering team, owned product direction, and was responsible for getting the product off the ground operationally. Internship in 2023.",
    lessons: [
      "Product management at an early-stage AI company is mostly about forcing clarity on what the product actually does and who it's actually for.",
      "Leading engineers as a non-engineer for the first time taught me how to communicate specs in ways that reduce back-and-forth and build trust with the team.",
    ],
  },
  "top-floor": {
    overview:
      "Top Floor was my first real product-management role. I built community and marketing infrastructure for AI companies, with automated marketing products sold to clients. Internship from 2022 to 2023.",
    lessons: [
      "Early PM experience sharpened my ability to translate a business problem into a product spec and hold a team accountable to shipping.",
      "Automated marketing products taught me that the most valuable thing you can build for a small client is something that runs without them touching it.",
    ],
  },
};
