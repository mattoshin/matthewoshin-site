import { describe, expect, it } from "vitest";
import { SYSTEM_PROMPT } from "@/app/api/oceanai/route";

/**
 * Pins the anti-hype guardrail in the OceanAI system prompt. Live testing
 * (2026-07-20) showed the model reaching for words like "unique," "stands
 * out," "highly accomplished," and "remarkable" on leading questions ("sell
 * me on him," "is he impressive") even though none of those words appear in
 * the prompt's factual content. The instruction below fixed it; this test
 * keeps it from silently regressing.
 */
describe("OceanAI system prompt", () => {
  it("instructs the model to avoid hype and sales language", () => {
    expect(SYSTEM_PROMPT).toMatch(/hype or sales language/i);
    expect(SYSTEM_PROMPT).toMatch(/state the facts plainly/i);
  });

  it("still forbids ocean metaphors and em dashes", () => {
    expect(SYSTEM_PROMPT).toMatch(/ocean, sea, or diving metaphors/i);
    expect(SYSTEM_PROMPT).toMatch(/never use em dashes/i);
  });
});
