"use client";

/**
 * BucketNav - the primary navigation. A sticky top bar that rides over BOTH the
 * bright surface and the dark deep, so it uses translucent pill backgrounds with
 * a backdrop blur and ink tokens that read either way.
 *
 * MULTI-PAGE: every bucket is a Next <Link> to its own route. The active page is
 * resolved from usePathname (aria-current). Clicking a deeper bucket navigates
 * client-side and the persistent ocean dives the camera to that page's depth.
 *
 * Responsive behavior:
 *   - lg and up: the full hugged pill row (wordmark left, the bucket links
 *     centered, socials right).
 *   - below lg: the links + controls cannot fit one phone row without
 *     clipping, so they collapse to a clean MENU. The wordmark stays at left and
 *     a compact hamburger button sits at right. Tapping it opens an accessible
 *     sheet listing every bucket plus the socials. Tapping a link navigates and
 *     closes the sheet.
 *
 * Accessibility:
 *   - Bucket links are real <a> (Next Link); controls are real <button>, all
 *     keyboard reachable, with a focus-visible ring from globals.css.
 *   - The active bucket carries aria-current="page" (desktop row + mobile sheet).
 *   - The hamburger has aria-expanded + aria-controls pointing at the sheet.
 *   - On open, focus moves into the sheet (first item) and Esc / a backdrop tap
 *     closes it; on close focus returns to the hamburger button.
 *   - Tab is kept inside the open sheet (a lightweight focus trap).
 *   - Nothing clips or overflows at any width.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUCKETS, SITE } from "@/data/content";
import { Socials } from "./Socials";

export default function BucketNav() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // When the sheet is open: lock the focus inside it, Esc closes, focus the
  // first control on open, and restore focus to the button on close.
  useEffect(() => {
    if (!menuOpen) return;

    const panel = panelRef.current;
    // Defer one tick so the panel is in the DOM before we move focus into it.
    const focusTimer = window.setTimeout(() => {
      const first = panel?.querySelector<HTMLElement>(
        'button, a, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }, 0);

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, a, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Return focus to the trigger when the sheet closes (after it was open).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (menuOpen) {
      wasOpen.current = true;
    } else if (wasOpen.current) {
      menuButtonRef.current?.focus();
      wasOpen.current = false;
    }
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-5">
        {/* Wordmark -> home (surface). Carries a subtle glass chip so the light
            wordmark reads over BOTH the bright surface and the dark deep. */}
        <Link
          href="/"
          className="min-w-0 shrink rounded-full border border-white/15 bg-deep-body/70 px-3 py-1.5 text-left backdrop-blur-md transition-colors hover:border-bio-cyan/50"
          aria-label="Matthew Oshin, return home"
        >
          <span className="block truncate font-display text-base font-semibold tracking-tight text-ink-heading sm:text-lg">
            {SITE.name}
          </span>
        </Link>

        {/* DESKTOP pill row (lg+). HUGS its content, stays centered, never wraps.
            Hidden below lg, where the hamburger menu takes over: the wordmark +
            pills + socials cannot fit one row on tablet without clipping, so
            anything narrower collapses to the menu. */}
        <nav
          aria-label="Sections"
          className="hidden min-w-0 flex-1 justify-center lg:flex"
        >
          <ul className="flex w-auto max-w-full items-center gap-1 rounded-full border border-white/15 bg-deep-body/70 px-1 py-1 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <li className="shrink-0">
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className={`block rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === "/"
                    ? "bg-bio-cyan text-abyss-void shadow-[0_0_18px_-3px_var(--bio-cyan)]"
                    : "text-ink-body hover:bg-white/10 hover:text-ink-heading"
                }`}
              >
                Home
              </Link>
            </li>
            {BUCKETS.map((bucket) => {
              const active = pathname === bucket.href;
              return (
                <li key={bucket.id} className="shrink-0">
                  <Link
                    href={bucket.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                      active
                        ? "bg-bio-cyan text-abyss-void shadow-[0_0_18px_-3px_var(--bio-cyan)]"
                        : "text-ink-body hover:bg-white/10 hover:text-ink-heading"
                    }`}
                  >
                    {bucket.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* DESKTOP right controls: social logos (lg+). */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Socials />
        </div>

        {/* MOBILE hamburger (below lg). Compact, never clips. */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-deep-body/70 p-2.5 text-ink-heading backdrop-blur-md transition-colors hover:border-bio-cyan/60 hover:text-bio-cyan lg:hidden"
        >
          {menuOpen ? <CloseGlyph /> : <MenuGlyph />}
        </button>
      </div>

      {/* MOBILE sheet (below lg). Rendered only when open. */}
      {menuOpen && (
        <div className="lg:hidden">
          {/* Backdrop: tap to dismiss. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={closeMenu}
            className="fixed inset-0 z-30 cursor-default bg-abyss-void/55 backdrop-blur-sm"
          />

          <div
            ref={panelRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute inset-x-3 top-[calc(100%-0.25rem)] z-40 origin-top rounded-2xl border border-white/15 bg-deep-body/95 p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl motion-safe:animate-[rise_0.25s_cubic-bezier(0.16,1,0.3,1)_both]"
          >
            <nav aria-label="Sections">
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/"
                    onClick={closeMenu}
                    aria-current={pathname === "/" ? "page" : undefined}
                    className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                      pathname === "/"
                        ? "bg-bio-cyan text-abyss-void"
                        : "text-ink-body hover:bg-white/10 hover:text-ink-heading"
                    }`}
                  >
                    Home
                  </Link>
                </li>
                {BUCKETS.map((bucket) => {
                  const active = pathname === bucket.href;
                  return (
                    <li key={bucket.id}>
                      <Link
                        href={bucket.href}
                        onClick={closeMenu}
                        aria-current={active ? "page" : undefined}
                        className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                          active
                            ? "bg-bio-cyan text-abyss-void"
                            : "text-ink-body hover:bg-white/10 hover:text-ink-heading"
                        }`}
                      >
                        {bucket.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="my-2 h-px bg-white/10" />

            <div className="mt-2 flex items-center justify-center gap-4">
              <Socials />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* -------------------------------- glyphs ---------------------------------- */

function MenuGlyph() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
