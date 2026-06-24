"use client";

import { useEffect, useState } from "react";

/**
 * The hero headline with a rotating identity word: "I'm a builder" -> "founder"
 * -> "analyst" -> ... Each word rises + sharpens in (the swap is the only motion).
 * Edit WORDS to change the set. The article (a/an) is derived so "an analyst"
 * stays grammatical. Screen readers get the full static phrase via aria-label.
 */
const WORDS = [
  "builder",
  "founder",
  "analyst",
  "operator",
  "thinker",
  "community builder",
] as const;

const articleFor = (w: string) => (/^[aeiou]/i.test(w) ? "an" : "a");

const SR_LABEL = `I'm a ${WORDS.slice(0, -1).join(", ")}, and ${WORDS[WORDS.length - 1]}.`;

export default function RotatingHeadline({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);

  const word = WORDS[i];

  return (
    <h1 className={className} aria-label={SR_LABEL}>
      <span aria-hidden="true">
        I&rsquo;m {articleFor(word)}{" "}
        {/* key forces the rise animation to replay on each word */}
        <span key={i} className="word-rise inline-block text-bio-cyan">
          {word}
        </span>
        .
      </span>
    </h1>
  );
}
