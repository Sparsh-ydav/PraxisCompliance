// Recheck Loop — Generalized compliance re-evaluation after proposed changes.
// Applies changes to a cloned blueprint, re-derives topics, retrieves affected regulations,
// and re-runs compliance checks to diff before/after findings.
//
// This replaces the hardcoded single-scenario recheck with a general-purpose pipeline
// that uses the existing Regulation Retrieval and Compliance-Check Architecture.

import type { Blueprint } from "@/fixtures/blueprints";
import { getBlueprintById } from "@/fixtures/blueprints";
import { FALLBACKS } from "@/fixtures/fallbacks";
import type { ComplianceFinding, ProposedChange, RippleSimulationResult } from "@/lib/schemas";
import { rippleEffectSource } from "@/lib/ripple-effect";

export interface RecheckResult {
  blueprintId: string;
  changes: ProposedChange[];
  results: RippleSimulationResult[];
  // Aggregate across all changes
  allResolvedFindingIds: string[];
  allNewFindings: ComplianceFinding[];
  finalReadinessScore: number;
  originalFindings: ComplianceFinding[];
  finalFindings: ComplianceFinding[];
}

/**
 * Run the full recheck loop for one or more proposed changes against a blueprint.
 * Each change is simulated independently through the Ripple Engine, then the results
 * are aggregated into a combined before/after diff.
 */
export async function recheckCompliance(
  blueprintId: string,
  changes: ProposedChange[]
): Promise<RecheckResult> {
  const blueprint = getBlueprintById(blueprintId);
  if (!blueprint) {
    throw new Error(`Blueprint '${blueprintId}' not found`);
  }

  const originalFallback = FALLBACKS[blueprintId];
  const originalFindings = originalFallback?.findings || [];

  // Run each change through the ripple engine
  const results: RippleSimulationResult[] = [];
  for (const change of changes) {
    const result = await rippleEffectSource.simulateChange({
      ...change,
      blueprintId, // Ensure blueprintId is consistent
    });
    results.push(result);
  }

  // Aggregate resolved findings across all changes (union)
  const allResolvedIds = new Set<string>();
  for (const r of results) {
    for (const id of r.resolvedFindingIds) {
      allResolvedIds.add(id);
    }
  }

  // Aggregate new findings across all changes (deduplicate by clauseId + elementId)
  const seenNewFindings = new Map<string, ComplianceFinding>();
  for (const r of results) {
    for (const f of r.newFindings) {
      const key = `${f.clauseId}:${f.elementId || f.id}`;
      if (!seenNewFindings.has(key)) {
        seenNewFindings.set(key, f);
      }
    }
  }
  const allNewFindings = Array.from(seenNewFindings.values());

  // Build final findings list
  const remainingOriginal = originalFindings.filter(
    (f) => !allResolvedIds.has(f.id)
  );
  const finalFindings = [...remainingOriginal, ...allNewFindings];

  // Calculate final readiness score
  const blockingCount = finalFindings.filter((f) => f.severity === "blocking" && !f.resolved).length;
  const advisoryCount = finalFindings.filter((f) => f.severity === "advisory" && !f.resolved).length;
  const finalReadinessScore = Math.max(0, 100 - blockingCount * 20 - advisoryCount * 5);

  return {
    blueprintId,
    changes,
    results,
    allResolvedFindingIds: Array.from(allResolvedIds),
    allNewFindings,
    finalReadinessScore,
    originalFindings,
    finalFindings,
  };
}
