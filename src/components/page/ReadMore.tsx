/**
 * ReadMore - the trailing "Read more ->" cue on a row that is entirely a link
 * (education rows on /education and /about). The row carries `group`, so the
 * arrow nudges and the colour lifts on hover of the whole row. Decorative
 * glyph hidden from assistive tech; the row's text is the accessible name.
 */
export default function ReadMore() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-bio-cyan transition-colors group-hover:text-bio-aqua">
      Read more
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        -&gt;
      </span>
    </span>
  );
}
