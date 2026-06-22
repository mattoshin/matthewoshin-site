// Galactic Signals "Monitor Builder" API — turns a plain-English description into
// a real, branded monitor config using Claude (Haiku) via plain fetch. This runs
// on a PUBLIC demo, so it is deliberately cheap and capped:
//   - model is Haiku 4.5 (cheapest), max_tokens is small
//   - per-IP rate limit + a process-wide daily call cap
//   - it NEVER returns a 500 or runs uncapped: a missing key, rate-limit, budget
//     cap, upstream failure, or unparseable output all degrade to a canned sample.
// The Anthropic key (ANTHROPIC_API_KEY) lives only in the Vercel env, server-side.

import { ADMIN_BUILDER_FALLBACK } from "@/data/galactic-admin-demo";

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 800;
const MAX_PROMPT_CHARS = 600;
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// --- Guardrails (best-effort, per warm serverless instance) ---------------
const PER_IP_PER_MIN = 6;
const DAILY_CALL_CAP = 300; // Haiku is ~fractions of a cent/call; this caps spend.

const ipHits = new Map<string, number[]>();
let dayKey = "";
let dayCount = 0;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (ipHits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  ipHits.set(ip, recent);
  return recent.length > PER_IP_PER_MIN;
}

function overDailyCap(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayKey) {
    dayKey = today;
    dayCount = 0;
  }
  dayCount += 1;
  return dayCount > DAILY_CALL_CAP;
}

const SYSTEM_PROMPT = `You are the Monitor Builder for Galactic Signals, a cross-asset market-intelligence platform that delivers branded real-time alerts (Discord-style embeds) to trading communities.

Given a plain-English description, design ONE monitor and reply with ONLY a JSON object (no prose, no markdown fences) of this exact shape:

{
  "name": string,                 // short product-style name, e.g. "BTC Volatility Monitor"
  "slug": string,                 // kebab-case, e.g. "btc-volatility"
  "feedSlug": string,             // kebab-case data feed slug
  "category": string,             // one of: stocks, crypto, prediction, sports, macro, realestate, news, gov, collectibles, weather
  "cron": string,                 // human schedule, e.g. "every 15 minutes" or "every market hour"
  "marketHoursOnly": boolean,
  "summary": string,              // 1-2 sentences on what it watches and when it fires
  "embed": {
    "title": string,              // starts with ONE relevant emoji, e.g. "₿ BTC Volatility"
    "color": string,              // hex like "#F7931A" fitting the category
    "fields": [ { "name": string, "value": string, "inline": boolean } ],  // 2-4 realistic fields with believable sample values
    "footer": "Galactic Signals"
  }
}

Use realistic figures and tickers. Keep it plausible for a real data API. Output JSON only.`;

interface BuilderEmbed {
  title: string;
  color: string;
  fields: { name: string; value: string; inline?: boolean }[];
  footer: string;
}
interface BuilderMonitor {
  name: string;
  slug: string;
  feedSlug: string;
  category: string;
  cron: string;
  marketHoursOnly: boolean;
  summary: string;
  embed: BuilderEmbed;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function fallback(): Response {
  return json({ monitor: ADMIN_BUILDER_FALLBACK, fallback: true });
}

interface AnthropicTextBlock {
  type: string;
  text?: string;
}
interface AnthropicMessage {
  content?: AnthropicTextBlock[];
}

function extractText(data: AnthropicMessage): string {
  if (!Array.isArray(data.content)) return "";
  return data.content
    .filter((b) => b.type === "text" && typeof b.text === "string")
    .map((b) => b.text as string)
    .join("")
    .trim();
}

// Pull the first {...} JSON object out of the model text (handles stray fences).
function parseMonitor(text: string): BuilderMonitor | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  let obj: unknown;
  try {
    obj = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
  if (typeof obj !== "object" || obj === null) return null;
  const m = obj as Record<string, unknown>;
  const embed = m.embed as Record<string, unknown> | undefined;
  if (typeof m.name !== "string" || typeof m.summary !== "string" || !embed || typeof embed.title !== "string" || !Array.isArray(embed.fields)) {
    return null;
  }
  return {
    name: String(m.name),
    slug: String(m.slug ?? "custom-monitor"),
    feedSlug: String(m.feedSlug ?? m.slug ?? "custom-feed"),
    category: String(m.category ?? "stocks"),
    cron: String(m.cron ?? "every 15 minutes"),
    marketHoursOnly: Boolean(m.marketHoursOnly),
    summary: String(m.summary),
    embed: {
      title: String(embed.title),
      color: typeof embed.color === "string" && /^#[0-9a-fA-F]{6}$/.test(embed.color) ? embed.color : "#1DD1A1",
      fields: (embed.fields as unknown[])
        .slice(0, 4)
        .map((f) => {
          const ff = f as Record<string, unknown>;
          return { name: String(ff.name ?? ""), value: String(ff.value ?? ""), inline: Boolean(ff.inline) };
        })
        .filter((f) => f.name && f.value),
      footer: "Galactic Signals",
    },
  };
}

export async function POST(req: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  const promptRaw = (payload as Record<string, unknown>)?.prompt;
  if (typeof promptRaw !== "string" || promptRaw.trim().length === 0) {
    return json({ error: "Body must include a non-empty prompt string." }, 400);
  }
  const prompt = promptRaw.trim().slice(0, MAX_PROMPT_CHARS);

  // Guardrails: rate limit + daily cap + missing key all degrade to a sample.
  const ip = (req.headers.get("x-forwarded-for") ?? "anon").split(",")[0].trim();
  if (rateLimited(ip)) return fallback();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallback();
  if (overDailyCap()) return fallback();

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: { "x-api-key": apiKey, "anthropic-version": ANTHROPIC_VERSION, "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!upstream.ok) {
      await upstream.text().catch(() => undefined);
      return fallback();
    }

    const data = (await upstream.json()) as AnthropicMessage;
    const monitor = parseMonitor(extractText(data));
    if (!monitor) return fallback();
    return json({ monitor });
  } catch {
    return fallback();
  }
}
