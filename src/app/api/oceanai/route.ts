// OceanAI chat API route — a playful deep-sea guide to Matthew Oshin's world.
// Talks to the Anthropic Messages API via plain fetch (no SDK dependency).
// Node runtime (default). Never returns a 500 to the user: missing key or
// upstream failure both degrade to a warm, on-brand canned reply.

type Role = "user" | "assistant";

interface ChatMessage {
  role: Role;
  content: string;
}

interface OceanAIResponse {
  reply: string;
  fallback?: boolean;
}

// --- Tuning knobs ---------------------------------------------------------
const MAX_TURNS = 12; // keep only the last ~12 turns of context
const MAX_CONTENT_CHARS = 1500; // cap each message's content length
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 600;
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// A short, warm canned reply used whenever the live model is unavailable.
// Still delivers a real one-line bio plus where to go next.
const FALLBACK_REPLY =
  "I'm OceanAI, your guide to Matthew Oshin's world. Matthew is a builder and Chief AI Officer at BrachyClip, " +
  "formerly VP of AI & Innovation at ICR, with a track record spanning equity research, hospitality (Element Underground), " +
  "and ventures like Mocean Technologies. Surface the buckets above to explore his work, or reach him directly at " +
  "matthewoshin@gmail.com.";

const SYSTEM_PROMPT = `You are OceanAI, a playful, warm deep-sea guide to the world of Matthew Oshin. You speak with light, tasteful ocean flavor: the occasional sea metaphor (currents, depths, tides, charting a course), never forced and never cringe. You are concise (2 to 5 sentences), genuinely helpful, and conversational.

You ONLY discuss Matthew Oshin: who he is, his work, his ventures, his skills, and this website. If someone asks about anything off-topic (general trivia, coding help, world events, other people), gently and briefly steer back to Matthew, then offer something you can actually help with.

Never use em dashes. Use periods, commas, or shorter sentences instead.

Here is what you know about Matthew Oshin. Use it to answer accurately; do not invent facts beyond this.

Matthew Oshin is a builder. He is Chief AI Officer at BrachyClip, an early-stage cancer medical device company. Most recently he was VP of AI & Innovation at ICR, where he led the AI & Intelligence Lab: building internal tools and client-facing AI products, driving firm-wide AI adoption, and setting AI strategy.

His foundation is in markets. He did equity research at Manatuck Hill, a hedge fund, covering AI infrastructure, nuclear energy, and precious metals.

He co-founded Element Underground, a hospitality group running large-scale events across NYC, Miami, Boston, and Ann Arbor, with more than 17,000 attendees. He founded Mocean Technologies, a research platform he scaled to $400K in revenue, more than 100,000 users, and over 1,000 investor communities before its acquisition. Earlier ventures: Profit Paradise, a paid community grown to roughly 3,500 members; Ocean Supply, sneaker arbitrage, which is where the ocean theme started; and Resell Network, an 11,000-member community sold along with Mocean.

What he builds now: Sigma, an options-implied distribution equity-research terminal, and Galactic Signals, a trading-signals platform.

Education: University of Michigan, B.A. in Economics.

Interests: DJing, sneakers, markets and investing, networking, and emerging tech.

How to reach him: matthewoshin@gmail.com, linkedin.com/in/mattoshin, and github.com/mattoshin.`;

function jsonResponse(body: OceanAIResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function badRequest(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "content-type": "application/json" },
  });
}

function isValidRole(value: unknown): value is Role {
  return value === "user" || value === "assistant";
}

// Validate, trim, and clamp the incoming messages. Returns the sanitized turns
// (last MAX_TURNS, each content capped) or null if the payload is malformed.
function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const cleaned: ChatMessage[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const candidate = item as Record<string, unknown>;
    if (!isValidRole(candidate.role)) return null;
    if (typeof candidate.content !== "string") return null;

    const content = candidate.content.trim();
    if (content.length === 0) continue; // drop empty turns silently

    cleaned.push({
      role: candidate.role,
      content: content.slice(0, MAX_CONTENT_CHARS),
    });
  }

  if (cleaned.length === 0) return null;
  return cleaned.slice(-MAX_TURNS);
}

// Anthropic returns content as an array of blocks; concatenate text blocks.
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
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text as string)
    .join("")
    .trim();
}

export async function POST(req: Request): Promise<Response> {
  // --- Parse + validate the request body --------------------------------
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }

  if (typeof payload !== "object" || payload === null) {
    return badRequest("Request body must be an object with a messages array.");
  }

  const messages = parseMessages((payload as Record<string, unknown>).messages);
  if (messages === null) {
    return badRequest(
      "messages must be a non-empty array of { role: 'user' | 'assistant', content: string }.",
    );
  }

  // --- Graceful fallback: no API key configured -------------------------
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse({ reply: FALLBACK_REPLY, fallback: true });
  }

  // --- Call Anthropic, degrading gracefully on any failure --------------
  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!upstream.ok) {
      // Drain the body so the connection can be reused, then fall back.
      await upstream.text().catch(() => undefined);
      return jsonResponse({ reply: FALLBACK_REPLY, fallback: true });
    }

    const data = (await upstream.json()) as AnthropicMessage;
    const reply = extractText(data);

    if (!reply) {
      return jsonResponse({ reply: FALLBACK_REPLY, fallback: true });
    }

    return jsonResponse({ reply });
  } catch {
    // Network error, timeout, malformed upstream JSON, etc.
    return jsonResponse({ reply: FALLBACK_REPLY, fallback: true });
  }
}
