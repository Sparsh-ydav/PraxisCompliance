// Evidence Graph & Change Impact Graph Data Model and Builders.
// Fulfills Phase 3 (item 12 Evidence Graph & item 21 Change Impact Graph).

import type { ComplianceFinding } from "@/lib/schemas";
import type { Blueprint } from "@/fixtures/blueprints";
import type { RippleEffectResult } from "@/lib/ripple-effect";
import { REGULATIONS } from "@/fixtures/regulations";
import { LEARNED_PATTERNS } from "@/fixtures/learned-patterns";

export type EvidenceGraphNodeType =
  | "finding"
  | "blueprintElement"
  | "regulationClause"
  | "historicalPattern"
  | "proposedChange";

export interface EvidenceGraphNode {
  id: string;
  type: EvidenceGraphNodeType;
  label: string;
  subtitle?: string;
  badge?: string;
  severity?: "blocking" | "advisory" | "neutral" | "resolved" | "surfaced";
}

export interface EvidenceGraphEdge {
  from: string;
  to: string;
  relation: string; // e.g. "references", "violates", "supported_by", "resolves", "triggers"
}

export interface GraphData {
  title: string;
  description: string;
  nodes: EvidenceGraphNode[];
  edges: EvidenceGraphEdge[];
}

/**
 * Builds the complete Evidence Chain for a single compliance finding:
 * Finding -> Blueprint Element -> Regulation Clause -> Historical Pattern (if applicable)
 */
export function buildEvidenceGraph(
  finding: ComplianceFinding,
  blueprint?: Blueprint
): GraphData {
  const nodes: EvidenceGraphNode[] = [];
  const edges: EvidenceGraphEdge[] = [];

  // 1. Finding Node
  nodes.push({
    id: finding.id,
    type: "finding",
    label: finding.issue.length > 50 ? `${finding.issue.slice(0, 48)}…` : finding.issue,
    subtitle: `ID: ${finding.id} • Confidence: ${(finding.confidence * 100).toFixed(0)}%`,
    badge: finding.severity.toUpperCase(),
    severity: finding.resolved ? "resolved" : finding.severity,
  });

  // 2. Blueprint Element Node (if present)
  if (finding.elementId) {
    const element = blueprint?.spatialMetadata?.elements.find(
      (e) => e.elementId === finding.elementId
    );
    const elementLabel = element ? element.label : `Element ${finding.elementId}`;

    nodes.push({
      id: `elem-${finding.elementId}`,
      type: "blueprintElement",
      label: elementLabel,
      subtitle: finding.evidence || `Spatial Element ID: ${finding.elementId}`,
      badge: "BLUEPRINT ELEMENT",
      severity: "neutral",
    });

    edges.push({
      from: finding.id,
      to: `elem-${finding.elementId}`,
      relation: "references element",
    });
  }

  // 3. Regulation Clause Node
  const clause = REGULATIONS.find((r) => r.id === finding.clauseId);
  const clauseId = finding.clauseId;
  const clauseTitle = clause ? `${clause.section} — ${clause.title}` : finding.clauseCitation;

  nodes.push({
    id: `clause-${clauseId}`,
    type: "regulationClause",
    label: clauseTitle,
    subtitle: clause?.text ? `${clause.text.slice(0, 75)}…` : finding.clauseCitation,
    badge: `CLAUSE ${clauseId}`,
    severity: "neutral",
  });

  edges.push({
    from: finding.id,
    to: `clause-${clauseId}`,
    relation: "violates / cites",
  });

  // 4. Historical Pattern Node (if source is learned_pattern or related clause)
  const pattern = LEARNED_PATTERNS.find(
    (p) =>
      p.codeReference.includes(finding.clauseId) ||
      (finding.source === "learned_pattern" &&
        (finding.id.includes("lp") || finding.clauseId === "SB-203" || finding.clauseId === "FE-109"))
  );

  if (pattern) {
    nodes.push({
      id: `pattern-${pattern.id}`,
      type: "historicalPattern",
      label: pattern.title,
      subtitle: `Observed in ${pattern.evidenceCount} historical permit applications (${(pattern.confidenceLevel * 100).toFixed(0)}% confidence)`,
      badge: "JURISDICTION PATTERN",
      severity: "neutral",
    });

    edges.push({
      from: `clause-${clauseId}`,
      to: `pattern-${pattern.id}`,
      relation: "enforced via pattern",
    });
  }

  return {
    title: `Evidence Graph — Finding ${finding.id}`,
    description: `Formal evidence verification chain connecting spatial fixture coordinates to municipal code citations and historical precedents.`,
    nodes,
    edges,
  };
}

/**
 * Builds the Change Impact Graph for a simulated ripple-engine change:
 * Blueprint Change -> Affected Element -> Resolved Findings -> Newly Surfaced Findings
 */
export function buildChangeImpactGraph(
  rippleResult: RippleEffectResult,
  blueprint?: Blueprint
): GraphData {
  const nodes: EvidenceGraphNode[] = [];
  const edges: EvidenceGraphEdge[] = [];
  const change = rippleResult.change;

  // 1. Root Change Node
  const changeId = `change-${change.elementId}-${change.property}`;
  nodes.push({
    id: changeId,
    type: "proposedChange",
    label: `Simulated: Modify ${change.elementId} ${change.property}`,
    subtitle: `Delta: ${change.delta > 0 ? `+${change.delta}` : change.delta}${change.unit}`,
    badge: "PROPOSED MODIFICATION",
    severity: "neutral",
  });

  // 2. Modified Blueprint Element
  const elemNodeId = `elem-${change.elementId}`;
  nodes.push({
    id: elemNodeId,
    type: "blueprintElement",
    label: `Element ${change.elementId}`,
    subtitle: `Property: ${change.property} (${change.unit})`,
    badge: "TARGET ELEMENT",
    severity: "neutral",
  });

  edges.push({
    from: changeId,
    to: elemNodeId,
    relation: "applies to",
  });

  // 3. Resolved Findings (green)
  rippleResult.resolvedFindingIds.forEach((resId) => {
    const nodeKey = `resolved-${resId}`;
    nodes.push({
      id: nodeKey,
      type: "finding",
      label: `Finding ${resId} (Egress Deficit)`,
      subtitle: "Requirement satisfied by simulated geometry shift",
      badge: "RESOLVED",
      severity: "resolved",
    });

    edges.push({
      from: elemNodeId,
      to: nodeKey,
      relation: "resolves violation",
    });
  });

  // 4. Newly Surfaced Findings (amber/rose)
  rippleResult.newFindings.forEach((newFinding) => {
    const nodeKey = `new-${newFinding.id}`;
    nodes.push({
      id: nodeKey,
      type: "finding",
      label: newFinding.issue.length > 50 ? `${newFinding.issue.slice(0, 48)}…` : newFinding.issue,
      subtitle: `Surfaced constraint: ${newFinding.clauseCitation}`,
      badge: "NEW CONFLICT",
      severity: "surfaced",
    });

    edges.push({
      from: elemNodeId,
      to: nodeKey,
      relation: "triggers downstream constraint",
    });

    // Link new finding to its affected clause
    const clauseNodeId = `clause-${newFinding.clauseId}`;
    nodes.push({
      id: clauseNodeId,
      type: "regulationClause",
      label: `Clause ${newFinding.clauseId}`,
      subtitle: newFinding.clauseCitation,
      badge: "ZONING REGULATION",
      severity: "neutral",
    });

    edges.push({
      from: nodeKey,
      to: clauseNodeId,
      relation: "violates",
    });
  });

  return {
    title: `Change Impact Graph — ${change.elementId} Modification`,
    description: `Downstream causal analysis: shows how shifting geometry resolves previous deficiencies while propagating constraints to lot setbacks.`,
    nodes,
    edges,
  };
}
