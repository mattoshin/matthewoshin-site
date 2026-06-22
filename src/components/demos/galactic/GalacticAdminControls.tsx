"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Icon, type IconName } from "./GalacticKit";

/**
 * GalacticAdminControls - the interactive layer for the Galactic admin console.
 * Generic, brand-styled primitives (Toggle, Modal, Drawer, Tabs, ActionMenu,
 * Stepper, Badge) plus a lightweight toast system, so every admin screen can
 * simulate real operations (toggle a feed, run a monitor, promote a user, create
 * a product) with optimistic local state and visible feedback. No backend, no
 * persistence, no Math.random/Date in render - all mutation timing lives in event
 * handlers. This is the leaf module: it only depends on the shared Icon set.
 */

const BORDER = "var(--g-border)";
const PANEL = "var(--g-panel)";
const PANEL2 = "var(--g-panel-2)";

/* ============================== toasts ================================== */

type ToastTone = "teal" | "blurple" | "warn" | "error";
interface ToastItem {
  id: number;
  msg: string;
  icon?: IconName;
  tone: ToastTone;
}

const TONE_COLOR: Record<ToastTone, string> = {
  teal: "#1DD1A1",
  blurple: "#5865F2",
  warn: "#F39C12",
  error: "#ED4245",
};

type PushToast = (msg: string, opts?: { icon?: IconName; tone?: ToastTone }) => void;
const ToastCtx = createContext<PushToast>(() => {});

/** Call inside any screen rendered under <ToastProvider> to flash a confirmation. */
export function useToast(): PushToast {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const push = useCallback<PushToast>((msg, opts) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, msg, icon: opts?.icon, tone: opts?.tone ?? "teal" }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
        {toasts.map((t) => {
          const c = TONE_COLOR[t.tone];
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm text-white shadow-xl"
              style={{ borderColor: BORDER, background: PANEL, animation: "g-pop 0.18s ease-out" }}
            >
              <span style={{ color: c }}>
                <Icon name={t.icon ?? "check"} size={16} />
              </span>
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

/* ============================== toggle ================================== */

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
      style={{
        background: on ? "var(--g-teal)" : PANEL2,
        border: `1px solid ${on ? "var(--g-teal)" : BORDER}`,
      }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
        style={{ transform: on ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  );
}

/* ============================== badge =================================== */

type BadgeTone = "teal" | "blurple" | "cyan" | "warn" | "error" | "muted";
const BADGE_COLOR: Record<BadgeTone, string> = {
  teal: "#1DD1A1",
  blurple: "#aab4fc",
  cyan: "#22D3EE",
  warn: "#F39C12",
  error: "#ED4245",
  muted: "#7C8DA8",
};

export function Badge({ tone = "muted", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  const c = BADGE_COLOR[tone];
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ background: `${c}1f`, color: c }}>
      {children}
    </span>
  );
}

/* =========================== overlay base =============================== */

function useDismiss(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useDismiss(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border"
        style={{ borderColor: BORDER, background: PANEL, animation: "g-pop 0.18s ease-out" }}
      >
        <div className="flex items-center justify-between border-b px-5 py-3.5" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-[var(--g-faint)] transition-colors hover:text-white" aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t px-5 py-3.5" style={{ borderColor: BORDER }}>{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useDismiss(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[55] flex justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex h-full w-full max-w-md flex-col border-l"
        style={{ borderColor: BORDER, background: PANEL, animation: "g-slide-in 0.2s ease-out" }}
      >
        <div className="flex items-start justify-between border-b px-5 py-4" style={{ borderColor: BORDER }}>
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-[var(--g-faint)]">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-[var(--g-faint)] transition-colors hover:text-white" aria-label="Close">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t px-5 py-4" style={{ borderColor: BORDER }}>{footer}</div>}
      </div>
    </div>
  );
}

/* =============================== tabs =================================== */

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string; count?: number }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-lg border p-1" style={{ borderColor: BORDER }}>
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors"
            style={on ? { background: PANEL2, color: "white" } : { color: "var(--g-muted)" }}
          >
            {t.label}
            {typeof t.count === "number" && <span className="ml-1.5 text-xs text-[var(--g-faint)]">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ============================ action menu =============================== */

export interface ActionItem {
  label: string;
  icon?: IconName;
  onClick: () => void;
  danger?: boolean;
}

export function ActionMenu({ items, label = "Row actions" }: { items: ActionItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDoc);
    return () => window.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--g-muted)] transition-colors hover:bg-white/5 hover:text-white"
      >
        <Icon name="dots" size={16} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-xl border py-1 shadow-xl"
          style={{ borderColor: BORDER, background: PANEL, animation: "g-pop 0.14s ease-out" }}
        >
          {items.map((it) => (
            <button
              key={it.label}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                it.onClick();
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-white/5"
              style={{ color: it.danger ? "#ED4245" : "var(--g-text)" }}
            >
              {it.icon && <Icon name={it.icon} size={15} />}
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== stepper ================================= */

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const c = done || active ? "var(--g-blurple)" : PANEL2;
        const txt = active ? "white" : done ? "#aab4fc" : "var(--g-faint)";
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: done || active ? "rgba(88,101,242,0.18)" : PANEL2, color: txt, border: `1px solid ${done || active ? "var(--g-blurple)" : BORDER}` }}
              >
                {done ? <Icon name="check" size={12} /> : i + 1}
              </span>
              <span className="hidden text-xs sm:inline" style={{ color: txt }}>{label}</span>
            </div>
            {i < steps.length - 1 && <span className="h-px w-4 sm:w-6" style={{ background: c }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ----- shared little controls reused by forms ----- */

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--g-faint)]">{children}</label>;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[var(--g-blurple)] placeholder:text-[var(--g-faint)] ${mono ? "font-mono" : ""}`}
      style={{ borderColor: BORDER }}
    />
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const style =
    variant === "primary"
      ? { background: "var(--g-teal)", color: "#04140f" }
      : variant === "danger"
      ? { background: "rgba(237,66,69,0.14)", color: "#ED4245", border: "1px solid rgba(237,66,69,0.4)" }
      : { color: "var(--g-text)", border: `1px solid ${BORDER}` };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-opacity disabled:opacity-40 ${pad}`}
      style={style}
    >
      {children}
    </button>
  );
}
