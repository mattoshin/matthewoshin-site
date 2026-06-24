/**
 * mtrain-demo.ts - sample data for the Fitness OS studio-operations demo.
 *
 * Fitness OS is a concept product: gym + studio operation software (schedule, leads,
 * members) drawn from the back-office dashboard I built for a real strength-and-
 * wellness studio. This demo is a clickable, de-branded recreation on entirely
 * fictional sample data: the studio (Foundry Strength), the manager (Jess Calder),
 * and every class, client, lead, and figure below is illustrative and made up.
 * Nothing talks to a live server. (Internal symbols keep the `Mtrain*`/`MT_*`
 * prefix from when this was built; the product is Fitness OS.)
 *
 * Refero-grounded structure: time2book (class schedule), Runey/Teal (KPI overview),
 * Rox (leads pipeline). Warm sand + evergreen theme lives in MtrainScope.
 */

import type { IconName } from "@/components/demos/mtrain/MtrainKit";

/* ----------------------------------------------------------------- brand --- */

export const MTRAIN = {
  name: "Fitness OS",
  product: "Studio operations",
  tagline: "The back office for a gym or strength-and-wellness studio.",
  studio: "Foundry Strength",
} as const;

/** The signed-in studio manager (fictional). */
export const MTRAIN_USER = {
  name: "Jess Calder",
  firstName: "Jess",
  initials: "JC",
  role: "Studio Manager",
} as const;

/* ----------------------------------------------------------- navigation --- */

export type ModuleId = "overview" | "schedule" | "leads" | "members";

export type NavItem = { id: ModuleId; label: string; icon: IconName };
export type NavSection = { label: string; color: string; items: NavItem[] };

export const MTRAIN_NAV: readonly NavSection[] = [
  {
    label: "Studio",
    color: "var(--mt-accent)",
    items: [
      { id: "overview", label: "Overview", icon: "home" },
      { id: "schedule", label: "Schedule", icon: "calendar" },
    ],
  },
  {
    label: "Growth",
    color: "var(--mt-sage)",
    items: [
      { id: "leads", label: "Leads", icon: "spark" },
      { id: "members", label: "Members", icon: "users" },
    ],
  },
] as const;

export const MODULE_LABELS: Record<ModuleId, string> = Object.fromEntries(
  MTRAIN_NAV.flatMap((s) => s.items.map((i) => [i.id, i.label])),
) as Record<ModuleId, string>;

/* ------------------------------------------------------------- overview --- */

export type Kpi = {
  label: string;
  value: string;
  delta: number;
  hint: string;
  icon: IconName;
  spark: number[];
};

export const MTRAIN_KPIS: readonly Kpi[] = [
  { label: "Bookings this week", value: "284", delta: 8.4, hint: "vs last week", icon: "calendar", spark: [210, 232, 221, 248, 256, 270, 284] },
  { label: "Active members", value: "176", delta: 3.5, hint: "+6 this month", icon: "users", spark: [158, 161, 164, 167, 170, 173, 176] },
  { label: "New leads", value: "23", delta: 27.8, hint: "this week", icon: "spark", spark: [9, 12, 11, 15, 14, 19, 23] },
  { label: "Revenue MTD", value: "$38.6k", delta: 6.1, hint: "vs last month", icon: "revenue", spark: [22, 26, 29, 31, 34, 36, 38.6] },
];

/** Weekly bookings trend (last 8 weeks) for the overview chart. */
export const BOOKINGS_TREND: readonly { label: string; value: number }[] = [
  { label: "Apr 28", value: 231 },
  { label: "May 5", value: 244 },
  { label: "May 12", value: 238 },
  { label: "May 19", value: 261 },
  { label: "May 26", value: 252 },
  { label: "Jun 2", value: 273 },
  { label: "Jun 9", value: 268 },
  { label: "Jun 16", value: 284 },
];

/** Class fill rate this week (for the donut): booked vs total capacity. */
export const FILL_RATE = { booked: 284, capacity: 352 } as const;

/** Mix of how this week's bookings split by class type (donut legend). */
export const CLASS_MIX: readonly { label: string; value: number; color: string }[] = [
  { label: "Strength", value: 118, color: "var(--mt-accent)" },
  { label: "Pilates / Reformer", value: 86, color: "var(--mt-sage)" },
  { label: "Conditioning", value: 52, color: "#C98A5E" },
  { label: "Recovery / Mobility", value: 28, color: "#9FB8AE" },
];

/* -------------------------------------------------------------- schedule --- */

export type ClassStatus = "open" | "full" | "waitlist" | "cancelled";

export type StudioClass = {
  id: string;
  name: string;
  type: "Strength" | "Pilates" | "Conditioning" | "Recovery";
  start: string; // "06:00"
  end: string;
  instructor: string;
  room: string;
  booked: number;
  capacity: number;
  status: ClassStatus;
};

export type ScheduleDay = { id: string; label: string; date: string; classes: StudioClass[] };

export const SCHEDULE_UPCOMING: readonly ScheduleDay[] = [
  {
    id: "today",
    label: "Today",
    date: "Monday, Jun 16",
    classes: [
      { id: "c1", name: "Power Strength", type: "Strength", start: "06:00", end: "06:50", instructor: "Marcus Reed", room: "Strength Floor", booked: 14, capacity: 16, status: "open" },
      { id: "c2", name: "Reformer Pilates", type: "Pilates", start: "07:15", end: "08:00", instructor: "Elena Voss", room: "Reformer Room", booked: 10, capacity: 10, status: "full" },
      { id: "c3", name: "HIIT 45", type: "Conditioning", start: "12:00", end: "12:45", instructor: "Dana Cole", room: "Studio A", booked: 18, capacity: 20, status: "open" },
      { id: "c4", name: "Foundations", type: "Strength", start: "17:30", end: "18:20", instructor: "Marcus Reed", room: "Strength Floor", booked: 16, capacity: 16, status: "waitlist" },
      { id: "c5", name: "Recovery & Mobility", type: "Recovery", start: "19:00", end: "19:45", instructor: "Priya Nair", room: "Studio B", booked: 7, capacity: 14, status: "open" },
    ],
  },
  {
    id: "tomorrow",
    label: "Tomorrow",
    date: "Tuesday, Jun 17",
    classes: [
      { id: "c6", name: "Olympic Lifting", type: "Strength", start: "06:00", end: "07:00", instructor: "Marcus Reed", room: "Strength Floor", booked: 9, capacity: 12, status: "open" },
      { id: "c7", name: "Vinyasa Flow", type: "Recovery", start: "08:30", end: "09:20", instructor: "Priya Nair", room: "Studio B", booked: 12, capacity: 16, status: "open" },
      { id: "c8", name: "Reformer Pilates", type: "Pilates", start: "10:00", end: "10:45", instructor: "Elena Voss", room: "Reformer Room", booked: 10, capacity: 10, status: "full" },
      { id: "c9", name: "Kettlebell Strong", type: "Conditioning", start: "18:00", end: "18:50", instructor: "Dana Cole", room: "Studio A", booked: 13, capacity: 18, status: "open" },
    ],
  },
  {
    id: "wed",
    label: "Wednesday",
    date: "Wednesday, Jun 18",
    classes: [
      { id: "c10", name: "Power Strength", type: "Strength", start: "06:00", end: "06:50", instructor: "Marcus Reed", room: "Strength Floor", booked: 11, capacity: 16, status: "open" },
      { id: "c11", name: "Mobility Flow", type: "Recovery", start: "09:00", end: "09:45", instructor: "Priya Nair", room: "Studio B", booked: 6, capacity: 14, status: "open" },
      { id: "c12", name: "HIIT 45", type: "Conditioning", start: "12:00", end: "12:45", instructor: "Dana Cole", room: "Studio A", booked: 20, capacity: 20, status: "full" },
    ],
  },
];

export const SCHEDULE_PAST: readonly ScheduleDay[] = [
  {
    id: "sun",
    label: "Yesterday",
    date: "Sunday, Jun 15",
    classes: [
      { id: "p1", name: "Open Gym", type: "Strength", start: "08:00", end: "10:00", instructor: "Staffed", room: "Strength Floor", booked: 22, capacity: 30, status: "open" },
      { id: "p2", name: "Reformer Pilates", type: "Pilates", start: "10:30", end: "11:15", instructor: "Elena Voss", room: "Reformer Room", booked: 10, capacity: 10, status: "full" },
      { id: "p3", name: "Recovery & Mobility", type: "Recovery", start: "16:00", end: "16:45", instructor: "Priya Nair", room: "Studio B", booked: 5, capacity: 14, status: "cancelled" },
    ],
  },
];

export const INSTRUCTORS: readonly string[] = ["Marcus Reed", "Elena Voss", "Dana Cole", "Priya Nair"];

/* ----------------------------------------------------------------- leads --- */

export type LeadSource = "Site form" | "Instagram" | "Referral" | "Walk-in" | "ClassPass";
export type LeadStage = "New" | "Contacted" | "Trial booked" | "Member" | "Lost";

export type Lead = {
  id: string;
  name: string;
  source: LeadSource;
  interest: string;
  stage: LeadStage;
  added: string;
  owner: string;
};

export const LEADS: readonly Lead[] = [
  { id: "l1", name: "Ava Thompson", source: "Site form", interest: "Reformer Pilates", stage: "New", added: "2h ago", owner: "Jess C." },
  { id: "l2", name: "Liam Ortiz", source: "Instagram", interest: "Strength · Foundations", stage: "New", added: "5h ago", owner: "Jess C." },
  { id: "l3", name: "Sophie Banner", source: "Referral", interest: "Personal training", stage: "Contacted", added: "Yesterday", owner: "Marcus R." },
  { id: "l4", name: "Noah Whitfield", source: "ClassPass", interest: "HIIT 45", stage: "Trial booked", added: "Yesterday", owner: "Dana C." },
  { id: "l5", name: "Maya Lindqvist", source: "Site form", interest: "Mobility / Recovery", stage: "Contacted", added: "2d ago", owner: "Priya N." },
  { id: "l6", name: "Carter Hughes", source: "Walk-in", interest: "Strength membership", stage: "Trial booked", added: "2d ago", owner: "Jess C." },
  { id: "l7", name: "Isabel Romano", source: "Instagram", interest: "Reformer Pilates", stage: "Member", added: "4d ago", owner: "Elena V." },
  { id: "l8", name: "Derek Malone", source: "Referral", interest: "Olympic lifting", stage: "Member", added: "5d ago", owner: "Marcus R." },
  { id: "l9", name: "Hannah Pierce", source: "Site form", interest: "Unlimited membership", stage: "Lost", added: "1w ago", owner: "Jess C." },
];

/** Lead pipeline summary (kanban-style counts for the Leads header). */
export const LEAD_STAGES: readonly { stage: LeadStage; count: number }[] = [
  { stage: "New", count: 2 },
  { stage: "Contacted", count: 2 },
  { stage: "Trial booked", count: 2 },
  { stage: "Member", count: 2 },
];

export const LEADS_THIS_WEEK = 23;
export const TRIAL_CONVERSION = 0.41; // 41% of trials convert to members

/* --------------------------------------------------------------- members --- */

export type MemberStatus = "Active" | "Trial" | "Frozen" | "Lapsed";

export type Member = {
  id: string;
  name: string;
  plan: string;
  status: MemberStatus;
  joined: string;
  lastVisit: string;
  visits30: number;
};

export const MEMBERS: readonly Member[] = [
  { id: "m1", name: "Isabel Romano", plan: "Unlimited", status: "Active", joined: "Jun 2026", lastVisit: "Today", visits30: 14 },
  { id: "m2", name: "Derek Malone", plan: "Strength 3x", status: "Active", joined: "Jun 2026", lastVisit: "Yesterday", visits30: 11 },
  { id: "m3", name: "Olivia Crane", plan: "Reformer 8-pack", status: "Active", joined: "May 2026", lastVisit: "2d ago", visits30: 7 },
  { id: "m4", name: "Noah Whitfield", plan: "Trial week", status: "Trial", joined: "Jun 2026", lastVisit: "Today", visits30: 3 },
  { id: "m5", name: "Grace Kim", plan: "Unlimited", status: "Active", joined: "Feb 2026", lastVisit: "3d ago", visits30: 9 },
  { id: "m6", name: "Theo Almeida", plan: "Strength 3x", status: "Frozen", joined: "Jan 2026", lastVisit: "3w ago", visits30: 0 },
  { id: "m7", name: "Carter Hughes", plan: "Trial week", status: "Trial", joined: "Jun 2026", lastVisit: "Yesterday", visits30: 2 },
  { id: "m8", name: "Nina Patel", plan: "Reformer 8-pack", status: "Active", joined: "Apr 2026", lastVisit: "Today", visits30: 8 },
  { id: "m9", name: "Wes Donnelly", plan: "Unlimited", status: "Lapsed", joined: "Nov 2025", lastVisit: "6w ago", visits30: 0 },
  { id: "m10", name: "Camila Reyes", plan: "Strength 3x", status: "Active", joined: "Mar 2026", lastVisit: "Yesterday", visits30: 10 },
];

export const MEMBER_SUMMARY = {
  total: 176,
  active: 142,
  trial: 9,
  frozen: 14,
  lapsedThisMonth: 4,
  retention: 0.92,
} as const;

/* --------------------------------------------------------- landing copy --- */

export type ModuleBlurb = { id: ModuleId; name: string; icon: IconName; blurb: string };
export const MTRAIN_MODULES: readonly ModuleBlurb[] = [
  { id: "overview", name: "Overview", icon: "home", blurb: "The studio at a glance: bookings, members, leads, and revenue, with this week's trend and class fill rate." },
  { id: "schedule", name: "Schedule", icon: "calendar", blurb: "Every class by day with instructor, room, and live capacity, so the front desk always knows what's full." },
  { id: "leads", name: "Leads", icon: "spark", blurb: "Inbound from the site form, Instagram, and referrals, tracked from first touch to trial to membership." },
  { id: "members", name: "Members", icon: "users", blurb: "The active roster: plans, status, and visit cadence, so you can spot who's thriving and who's slipping." },
];

export const MTRAIN_PAINS: readonly { title: string; body: string }[] = [
  { title: "The back office lived in five tabs", body: "Mindbody for bookings, a spreadsheet for leads, Instagram DMs, email, and a notebook at the front desk. Nothing talked to anything." },
  { title: "Leads fell through the cracks", body: "A site inquiry or an Instagram DM is a warm lead with a short shelf life, but without one place to track them, half went cold before anyone followed up." },
  { title: "No read on the studio's health", body: "Fill rate, retention, and the leads-to-members funnel were felt, not seen. The owner ran on instinct because the numbers were scattered." },
];

export const MTRAIN_STEPS: readonly { n: number; title: string; body: string }[] = [
  { n: 1, title: "One back office", body: "Schedule, leads, and members in a single calm dashboard over the studio's real Mindbody data, instead of five disconnected tools." },
  { n: 2, title: "Every lead tracked", body: "Inbound from the site form and socials lands in one pipeline, from first touch through trial to membership, so nothing goes cold." },
  { n: 3, title: "The studio, at a glance", body: "Bookings, fill rate, revenue, and retention up front, so the owner can see the business and not just feel it." },
];

export const MTRAIN_FACTS: readonly { value: string; label: string }[] = [
  { value: "1", label: "back office, not five" },
  { value: "176", label: "members tracked" },
  { value: "41%", label: "trial → member" },
  { value: "92%", label: "retention" },
];

export const MTRAIN_STACK: readonly { group: string; color: string; items: string[] }[] = [
  { group: "Frontend", color: "var(--mt-accent)", items: ["Next.js 16", "React 19", "Tailwind v4", "Editorial serif + mono"] },
  { group: "Data", color: "var(--mt-sage)", items: ["Mindbody data layer", "Bookings + classes", "Members + plans", "Lead pipeline"] },
  { group: "Platform", color: "#C98A5E", items: ["Supabase auth", "Resend lead capture", "Vercel", "Conversion-first IA"] },
];
