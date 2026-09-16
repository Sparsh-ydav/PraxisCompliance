// Zod schemas for all agent I/O in PraxisCompliance.
// Every LLM response is validated against one of these schemas before touching the UI.

import { z } from "zod";

// --- Blueprint Change (input for the generalized Ripple Engine) ---
export const BlueprintChangeSchema = z.object({
  elementId: z.string(),              // e.g. "W2", "rm-003", "D1"
  property: z.enum(["position", "width", "height", "sillHeight"]),
  delta: z.number(),                  // signed change amount
  unit: z.enum(["mm", "in", "ft"]),
});

export type BlueprintChange = z.infer<typeof BlueprintChangeSchema>;

// --- Compliance Finding ---
export const ComplianceFindingSchema = z.object({
  id: z.string(),
  issue: z.string().min(1),
  detail: z.string().min(1),
  clauseId: z.string(),
  clauseCitation: z.string(),
  evidence: z.string().optional(),
  elementId: z.string().optional(),       // links finding to a spatial element for Visual Evidence Layer
  severity: z.enum(["blocking", "advisory"]),
  source: z.enum(["written_code", "learned_pattern"]),
  confidence: z.number().min(0).max(1),
  isRippleEffect: z.boolean().optional(),
  rippleLabel: z.string().optional(),
  resolved: z.boolean().optional(),
});

export type ComplianceFinding = z.infer<typeof ComplianceFindingSchema>;

// --- Compliance Result (output of the Compliance Checker) ---
export const ComplianceResultSchema = z.object({
  blueprintId: z.string(),
  clausesChecked: z.number().int().positive(),
  findings: z.array(ComplianceFindingSchema),
  governanceNote: z.string().min(1),
  agentReasoning: z.string(),
});

export type ComplianceResult = z.infer<typeof ComplianceResultSchema>;

// --- Action Plan Item (output of the Correction Drafter — applicant mode) ---
export const ActionPlanItemSchema = z.object({
  priority: z.number().int().min(1),
  action: z.string().min(1),
  reason: z.string(),
  findingId: z.string(),
  severity: z.enum(["blocking", "advisory"]),
});

export type ActionPlanItem = z.infer<typeof ActionPlanItemSchema>;

export const ActionPlanSchema = z.object({
  blueprintId: z.string(),
  blockingCount: z.number().int().min(0),
  advisoryCount: z.number().int().min(0),
  items: z.array(ActionPlanItemSchema),
  summary: z.string(),
});

export type ActionPlan = z.infer<typeof ActionPlanSchema>;

// --- Correction Letter (output of the Correction Drafter — reviewer mode) ---
export const CorrectionLetterDraftSchema = z.object({
  applicationId: z.string(),
  letterText: z.string().min(1),
  correctionItemCount: z.number().int().min(0),
});

export type CorrectionLetterDraft = z.infer<typeof CorrectionLetterDraftSchema>;

// --- Retrieved Regulation Clauses ---
export const RetrievedClausesSchema = z.object({
  blueprintId: z.string(),
  topics: z.array(z.string()),
  clauses: z.array(
    z.object({
      id: z.string(),
      section: z.string(),
      title: z.string(),
      text: z.string(),
    })
  ),
});

export type RetrievedClauses = z.infer<typeof RetrievedClausesSchema>;
