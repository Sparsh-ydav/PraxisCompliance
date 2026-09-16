// Compliance Checker API route — the core agent of PraxisCompliance.
// Accepts a blueprintId, retrieves relevant regulations + learned patterns,
// runs the compliance check (LLM or fallback), and returns validated findings.

import type { NextRequest } from "next/server";
import { getBlueprintById } from "@/fixtures/blueprints";
import { LEARNED_PATTERNS } from "@/fixtures/learned-patterns";
import { FALLBACKS } from "@/fixtures/fallbacks";
import { retrieveRegulations, deriveTopics } from "@/lib/retriever";
import { callLLM } from "@/lib/llm";
import { ComplianceResultSchema } from "@/lib/schemas";
import type { ComplianceResult } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blueprintId } = body as { blueprintId: string };

    if (!blueprintId) {
      return Response.json({ error: "blueprintId is required" }, { status: 400 });
    }

    const blueprint = getBlueprintById(blueprintId);
    if (!blueprint) {
      return Response.json({ error: `Blueprint '${blueprintId}' not found` }, { status: 404 });
    }

    const fallback = FALLBACKS[blueprintId];
    if (!fallback) {
      return Response.json({ error: `No fallback data for blueprint '${blueprintId}'` }, { status: 500 });
    }

    // 1. Retrieve relevant regulation clauses
    const topics = deriveTopics(blueprint);
    const clauses = retrieveRegulations(topics);

    // 2. Build the LLM prompt
    const prompt = buildCompliancePrompt(blueprint, clauses, LEARNED_PATTERNS);

    // 3. Call LLM (with Zod validation + fallback)
    const { result, usedFallback } = await callLLM<ComplianceResult>({
      prompt,
      schema: ComplianceResultSchema,
      fallback,
      agentName: "ComplianceChecker",
    });

    return Response.json({ ...result, usedFallback });
  } catch (err) {
    console.error("[ComplianceChecker] Unhandled error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildCompliancePrompt(
  blueprint: ReturnType<typeof getBlueprintById>,
  clauses: ReturnType<typeof retrieveRegulations>,
  patterns: typeof LEARNED_PATTERNS
): string {
  const clauseText = clauses
    .map((c) => `[${c.id}] ${c.section} — ${c.title}\n${c.text}`)
    .join("\n\n");

  const patternText = patterns
    .map(
      (p) =>
        `[${p.id}] ${p.title} (confidence: ${p.confidenceLevel})\n${p.description}\nEnforcement: ${p.enforcementBehavior}`
    )
    .join("\n\n");

  return `You are a building permit compliance checker for Maplewood Township. Analyze the submitted blueprint against the regulation clauses and historical reviewer patterns below. Return ONLY valid JSON matching the schema exactly.

## Blueprint Data
${JSON.stringify(blueprint, null, 2)}

## Relevant Regulation Clauses (${clauses.length} clauses)
${clauseText}

## Learned Reviewer Patterns (${patterns.length} patterns)
${patternText}

## Instructions
1. Check every regulation clause against the blueprint data.
2. Also apply the learned reviewer patterns — if a pattern indicates reviewers flag something, include it as a finding with source "learned_pattern".
3. For each finding, assign severity: "blocking" (must fix before permit) or "advisory" (should address, may be waived).
4. For each finding, cite the specific parsed blueprint element in "evidence" (e.g. "Window W2, basement bedroom (south wall) — parsed net clear opening: 16\" × 22\"").
5. Always include the governance note: "X issues detected in automated check against N clauses — human reviewer sign-off required before permit issuance."
6. If no issues are found, return an empty findings array and note: "No issues detected in automated check against N clauses — human reviewer sign-off required before permit issuance."

## Required JSON Schema
{
  "blueprintId": "${blueprint!.id}",
  "clausesChecked": <number of clauses checked>,
  "findings": [
    {
      "id": "f-<unique>",
      "issue": "<short issue title>",
      "detail": "<detailed explanation including specific dimensions/values>",
      "clauseId": "<regulation clause ID like FE-102>",
      "clauseCitation": "<section and title>",
      "evidence": "<specific parsed blueprint element, e.g. Window W2, basement bedroom (south wall) — parsed: 16\" x 22\">",
      "severity": "blocking" | "advisory",
      "source": "written_code" | "learned_pattern",
      "confidence": <0.0 to 1.0>
    }
  ],
  "governanceNote": "<required governance framing>",
  "agentReasoning": "<brief explanation of what was checked and what was found>"
}

Return only the JSON object, no markdown, no explanation.`;
}
