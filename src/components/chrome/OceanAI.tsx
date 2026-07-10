"use client";

/**
 * OceanAI - a floating chat widget pinned to the bottom-right of the descent.
 *
 * A bioluminescent FAB (an anglerfish-lure glyph) that opens a glassy ocean-dark
 * chat panel. It talks to POST /api/oceanai with the running { messages } array
 * (roles user/assistant, content strings) and renders { reply } from the
 * response. State lives entirely in this component; nothing is persisted.
 *
 * Brand: reuses the site's ocean tokens (bio-cyan / bio-aqua glow, ink-* text,
 * dark translucent glass + backdrop-blur). Assistant bubbles are tinted cyan.
 *
 * Accessibility:
 *   - The FAB and every control is a real <button>.
 *   - The panel is a labelled dialog (role="dialog" aria-modal aria-label).
 *   - Esc closes; Enter sends (Shift+Enter inserts a newline).
 *   - On open, focus moves into the input; on close it returns to the FAB.
 *   - Honors prefers-reduced-motion (no transform/scale animations when reduced).
 *
 * Mounting: this file does not mount itself. The integrator renders <OceanAI />
 * once, high in the tree (e.g. in the root layout, after the canvas).
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
}

/** Keep only the last N turns we send to the API (cost + latency guard). */
const MAX_TURNS = 12;

const GREETING =
  "Hi, I'm OceanAI. Ask me anything about Matthew and his work.";

const STARTERS = [
  "What has Matthew built?",
  "Tell me about Mocean",
  "What's his background in AI?",
] as const;

const ERROR_TEXT = "Something went wrong. Please try again.";

export default function OceanAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  const fabRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const taglineId = useId();

  /** True only when the OS explicitly asks for reduced motion. */
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Open the panel, seeding the greeting the first time it's shown.
  const openPanel = useCallback(() => {
    setMessages((prev) =>
      prev.length === 0 ? [{ role: "assistant", content: GREETING }] : prev,
    );
    setOpen(true);
  }, []);

  // Move focus into the input on open; return it to the FAB on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      // Defer so the panel has mounted before we focus.
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      wasOpen.current = true;
      return () => window.clearTimeout(id);
    }
    if (wasOpen.current) {
      fabRef.current?.focus();
      wasOpen.current = false;
    }
  }, [open]);

  // Auto-scroll the message list to the newest content.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReducedMotion.current ? "auto" : "smooth",
    });
  }, [messages, pending]);

  // Esc closes the panel from anywhere on the page while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || pending) return;

      setError(false);
      setInput("");

      // Append the user turn, then derive the payload from the new state.
      const next = [...messages, { role: "user" as const, content: trimmed }];
      setMessages(next);
      setPending(true);

      const payload = next.slice(-MAX_TURNS);

      try {
        const res = await fetch("/api/oceanai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: { reply?: unknown } = await res.json();
        const reply = typeof data.reply === "string" ? data.reply : "";
        if (!reply) throw new Error("Empty reply");
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setError(true);
      } finally {
        setPending(false);
        inputRef.current?.focus();
      }
    },
    [messages, pending],
  );

  const onInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void send(input);
      }
    },
    [input, send],
  );

  const showStarters = open && messages.length <= 1 && !pending;

  return (
    <>
      {/* Floating action button */}
      <button
        ref={fabRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={open ? "Close OceanAI chat" : "Open OceanAI chat"}
        title="OceanAI"
        className={`pointer-events-auto fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-bio-cyan/40 bg-black/55 text-bio-cyan backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 hover:border-bio-cyan/80 hover:text-bio-aqua focus-visible:outline-none motion-reduce:transition-none ${
          open
            ? "shadow-[0_0_0_1px_color-mix(in_srgb,var(--bio-cyan)_55%,transparent),0_0_28px_color-mix(in_srgb,var(--bio-cyan)_45%,transparent)]"
            : "shadow-[0_0_18px_color-mix(in_srgb,var(--bio-cyan)_35%,transparent)] hover:scale-105 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--bio-cyan)_55%,transparent)] motion-reduce:hover:scale-100"
        }`}
      >
        {open ? (
          <CloseGlyph />
        ) : (
          <span className="relative flex items-center justify-center">
            <LureGlyph />
            {/* Bioluminescent ping on the lure (suppressed under reduced motion) */}
            <span
              aria-hidden="true"
              className="absolute -top-1 right-0.5 h-1.5 w-1.5 rounded-full bg-bio-aqua shadow-[0_0_8px_var(--bio-aqua)] motion-safe:animate-ping"
            />
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={taglineId}
          className="pointer-events-auto fixed bottom-24 right-5 z-50 flex w-[min(360px,calc(100vw-2.5rem))] max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-bio-cyan/25 bg-[color-mix(in_srgb,var(--abyss-body)_82%,transparent)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--bio-cyan)_18%,transparent),0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl motion-safe:animate-[rise_0.35s_cubic-bezier(0.16,1,0.3,1)_both]"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-b from-bio-cyan/10 to-transparent px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-bio-cyan/40 bg-black/40 text-bio-cyan shadow-[0_0_14px_color-mix(in_srgb,var(--bio-cyan)_35%,transparent)]"
              >
                <LureGlyph small />
              </span>
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="font-display text-sm font-semibold leading-tight text-ink-heading glow-cyan"
                >
                  OceanAI
                </h2>
                <p id={taglineId} className="text-[11px] leading-tight text-ink-muted">
                  Ask about Matthew's work
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss chat panel"
              className="shrink-0 rounded-md p-1 text-ink-muted transition-colors hover:text-bio-cyan focus-visible:outline-none"
            >
              <CloseGlyph small />
            </button>
          </div>

          {/* Message list */}
          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4 [scrollbar-width:thin]"
          >
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}

            {pending && (
              <div className="flex justify-start" aria-live="polite">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-bio-cyan/25 bg-bio-cyan/10 px-3 py-2.5">
                  <span className="sr-only">OceanAI is typing</span>
                  <Dot delay="0ms" />
                  <Dot delay="150ms" />
                  <Dot delay="300ms" />
                </div>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-bio-violet/30 bg-bio-violet/10 px-3 py-2 text-xs text-ink-body"
              >
                {ERROR_TEXT}
              </p>
            )}
          </div>

          {/* Starter suggestion chips (first open only) */}
          {showStarters && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-full border border-bio-cyan/30 bg-bio-cyan/5 px-3 py-1.5 text-[11px] font-medium text-bio-cyan transition-colors hover:border-bio-cyan/70 hover:bg-bio-cyan/15 focus-visible:outline-none"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="border-t border-white/10 bg-black/25 px-3 py-3">
            <div className="flex items-end gap-2">
              <label htmlFor={`${titleId}-input`} className="sr-only">
                Message OceanAI
              </label>
              <textarea
                ref={inputRef}
                id={`${titleId}-input`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                rows={1}
                placeholder="Ask a question…"
                disabled={pending}
                className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-sm text-ink-heading placeholder:text-ink-faint focus-visible:border-bio-cyan/60 focus-visible:outline-none disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => void send(input)}
                disabled={pending || input.trim().length === 0}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-bio-cyan/40 bg-bio-cyan/15 text-bio-cyan transition-colors hover:border-bio-cyan/80 hover:bg-bio-cyan/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-bio-cyan/15"
              >
                <SendGlyph />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ----------------------------- presentational ----------------------------- */

function Bubble({ role, content }: ChatMessage) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-white/10 text-ink-heading"
            : "rounded-bl-sm border border-bio-cyan/25 bg-bio-cyan/10 text-ink-body"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      aria-hidden="true"
      className="h-1.5 w-1.5 rounded-full bg-bio-cyan/80 motion-safe:animate-bounce"
      style={{ animationDelay: delay }}
    />
  );
}

/* -------------------------------- glyphs ---------------------------------- */

/** Anglerfish lure: a small body with a glowing bulb on a stalk. */
function LureGlyph({ small }: { small?: boolean }) {
  const size = small ? 16 : 22;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* fish body */}
      <path d="M4 14c0-3 2.4-5 5.4-5 2.6 0 4.6 1.4 5.4 3.6" />
      <path d="M15 17c-1 1.2-3 2-5.6 2C6.4 19 4 17 4 14" />
      {/* tail */}
      <path d="M15.2 12.6 19 10.5v6l-3.6-2" />
      {/* lure stalk + bulb */}
      <path d="M9.4 9C9 6.8 9.8 5 11.6 4" />
      <circle cx="12.4" cy="3.3" r="1.4" fill="currentColor" stroke="none" />
      {/* eye */}
      <circle cx="8" cy="13.4" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CloseGlyph({ small }: { small?: boolean }) {
  const size = small ? 16 : 20;
  return (
    <svg
      width={size}
      height={size}
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

function SendGlyph() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12 20 4l-4 16-4.5-6L4 12Z" />
      <path d="M11.5 14 16 8" />
    </svg>
  );
}
