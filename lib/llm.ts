// LLM call wrapper for PraxisCompliance agents.
// Pattern: structured prompt → Gemini API call → Zod validate → 1 retry → hardcoded fallback.
// When GEMINI_API_KEY is not set, skips straight to the fallback (offline demo mode).

import { z } from "zod";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

interface LLMCallOptions<T> {
  prompt: string;
  schema: z.ZodType<T>;
  fallback: T;
  /** Human-readable label for logging */
  agentName: string;
}

/**
 * Call the LLM with a structured-output prompt, validate the response,
 * retry once on failure, then fall back to the hardcoded fallback.
 */
export async function callLLM<T>(options: LLMCallOptions<T>): Promise<{ result: T; usedFallback: boolean }> {
  const { prompt, schema, fallback, agentName } = options;

  if (!GEMINI_API_KEY) {
    console.log(`[${agentName}] No GEMINI_API_KEY — using fallback data.`);
    return { result: fallback, usedFallback: true };
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await callGemini(prompt);
      const parsed = extractJSON(raw);
      const validated = schema.parse(parsed);
      console.log(`[${agentName}] LLM call succeeded on attempt ${attempt}.`);
      return { result: validated, usedFallback: false };
    } catch (err) {
      console.warn(`[${agentName}] Attempt ${attempt} failed:`, err instanceof Error ? err.message : err);
      if (attempt === 2) {
        console.warn(`[${agentName}] Both attempts failed — using fallback data.`);
      }
    }
  }

  return { result: fallback, usedFallback: true };
}

async function callGemini(prompt: string): Promise<string> {
  const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini response missing content text");
  }
  return text;
}

/** Strip markdown code fences and parse JSON from a possibly-wrapped LLM response */
function extractJSON(raw: string): unknown {
  const stripped = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(stripped);
}
