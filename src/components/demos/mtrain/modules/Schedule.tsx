"use client";

import { useState } from "react";
import {
  cx,
  Card,
  Badge,
  Icon,
  SectionHeading,
  SegmentedTabs,
  CapacityBar,
  MT_SERIF,
  type Tone,
} from "../MtrainKit";
import {
  SCHEDULE_UPCOMING,
  SCHEDULE_PAST,
  type ScheduleDay,
  type StudioClass,
  type ClassStatus,
} from "@/data/mtrain-demo";

/**
 * Schedule - the studio's class calendar by day. Refero-grounded on time2book's
 * fitness-studio schedule: an Upcoming/Past toggle, classes grouped under day
 * headers, and scannable class cards with time, instructor, room, live capacity,
 * and a status pill. A colored left accent bar codes each class by type. Warm-sand
 * + evergreen "Studio" theme via the scoped --mt-* tokens; serif for display,
 * mono for times. Fictional sample data; nothing talks to a live server.
 */

/** Left accent bar color, by class type. */
const TYPE_ACCENT: Record<StudioClass["type"], string> = {
  Strength: "var(--mt-accent)",
  Pilates: "var(--mt-sage)",
  Conditioning: "var(--mt-clay)",
  Recovery: "#9FB8AE",
};

/** Badge tone for the class-type chip. */
const TYPE_TONE: Record<StudioClass["type"], Tone> = {
  Strength: "accent",
  Pilates: "sage",
  Conditioning: "clay",
  Recovery: "neutral",
};

/** Right-side status pill: tone + label, by class status. */
const STATUS_BADGE: Record<ClassStatus, { tone: Tone; label: string }> = {
  open: { tone: "sage", label: "Open" },
  full: { tone: "clay", label: "Full" },
  waitlist: { tone: "warn", label: "Waitlist" },
  cancelled: { tone: "down", label: "Cancelled" },
};

function ClassRow({ c }: { c: StudioClass }) {
  const cancelled = c.status === "cancelled";
  const status = STATUS_BADGE[c.status];
  return (
    <Card padded={false} className={cx("overflow-hidden", cancelled && "opacity-60")}>
      <div className="flex items-stretch">
        {/* type accent bar */}
        <span
          aria-hidden="true"
          className="w-1 shrink-0 self-stretch"
          style={{ background: TYPE_ACCENT[c.type] }}
        />
        <div className="min-w-0 flex-1 p-4">
          {/* title row */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <h3
              className={cx(
                "min-w-0 text-[15px] font-semibold tracking-tight text-[var(--mt-ink)]",
                MT_SERIF,
                cancelled && "line-through",
              )}
            >
              {c.name}
            </h3>
            <Badge tone={TYPE_TONE[c.type]}>{c.type}</Badge>
            <span className="ml-auto shrink-0">
              <Badge tone={status.tone}>{status.label}</Badge>
            </span>
          </div>

          {/* meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--mt-muted)]">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Icon name="clock" size={14} className="shrink-0 text-[var(--mt-faint)]" />
              <span className="font-mono tabular-nums">
                {c.start} — {c.end}
              </span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Icon name="user" size={14} className="shrink-0 text-[var(--mt-faint)]" />
              <span className="truncate">{c.instructor}</span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Icon name="mapPin" size={14} className="shrink-0 text-[var(--mt-faint)]" />
              <span className="truncate">{c.room}</span>
            </span>
          </div>

          {/* capacity */}
          <div className="mt-3">
            <CapacityBar booked={c.booked} capacity={c.capacity} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function DayGroup({ day }: { day: ScheduleDay }) {
  return (
    <section>
      <div className="mb-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
        <h3 className={cx("text-[16px] font-semibold tracking-tight text-[var(--mt-ink)]", MT_SERIF)}>
          {day.label}
        </h3>
        <span className="text-[12px] text-[var(--mt-muted)]">{day.date}</span>
      </div>
      <div className="space-y-2.5">
        {day.classes.map((c) => (
          <ClassRow key={c.id} c={c} />
        ))}
      </div>
    </section>
  );
}

export default function Schedule() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const days = tab === "upcoming" ? SCHEDULE_UPCOMING : SCHEDULE_PAST;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Schedule"
        hint="Westport studio"
        right={
          <SegmentedTabs
            tabs={[
              { id: "upcoming", label: "Upcoming" },
              { id: "past", label: "Past" },
            ]}
            value={tab}
            onChange={setTab}
          />
        }
      />

      <div className="space-y-7">
        {days.map((day) => (
          <DayGroup key={day.id} day={day} />
        ))}
      </div>
    </div>
  );
}
