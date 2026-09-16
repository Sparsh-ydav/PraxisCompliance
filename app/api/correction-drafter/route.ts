// Correction Drafter API route
// Supports two modes:
// - "applicant": generates a plain-language prioritized action plan
// - "reviewer": generates a formal correction letter for municipal use

import type { NextRequest } from "next/server";
import { getApplicationById } from "@/fixtures/reviewer-queue";
import { FALLBACK_LETTERS } from "@/fixtures/fallback-letters";
import { callLLM } from "@/lib/llm";
import { CorrectionLetterDraftSchema } from "@/lib/schemas";
import type { CorrectionLetterDraft, ComplianceFinding } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, mode = "reviewer" } = body as {
      applicationId: string;
      mode?: "applicant" | "reviewer";
    };

    if (!applicationId) {
      return Response.json({ error: "applicationId is required" }, { status: 400 });
    }

    const application = getApplicationById(applicationId);
    if (!application) {
      return Response.json({ error: `Application '${applicationId}' not found` }, { status: 404 });
    }

    const fallbackLetter = FALLBACK_LETTERS[applicationId] || generateGenericFallbackLetter(application);

    if (mode === "reviewer") {
      // Generate formal correction letter
      const prompt = buildReviewerLetterPrompt(application);

      const { result, usedFallback } = await callLLM<CorrectionLetterDraft>({
        prompt,
        schema: CorrectionLetterDraftSchema,
        fallback: {
          applicationId,
          letterText: fallbackLetter,
          correctionItemCount: application.findings.length,
        },
        agentName: "CorrectionDrafter-Reviewer",
      });

      return Response.json({ ...result, usedFallback });
    } else {
      // Applicant mode - generate action plan (not yet implemented in this checkpoint)
      return Response.json({
        error: "Applicant mode not yet implemented in this route",
      }, { status: 501 });
    }
  } catch (err) {
    console.error("[CorrectionDrafter] Unhandled error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildReviewerLetterPrompt(application: ReturnType<typeof getApplicationById>): string {
  if (!application) return "";

  const findingsText = application.findings
    .map((f, i) => `${i + 1}. [${f.severity.toUpperCase()}] ${f.issue}\n   ${f.detail}\n   Citation: ${f.clauseCitation}`)
    .join("\n\n");

  return `You are drafting a formal building permit correction letter under the National Building Code of India (NBC 2016) for the Municipal Corporation Department of Town Planning & Building Sanction. Generate a professional scrutiny objection notice in the style of municipal authorities.

## Application Details
Case Number: ${application.caseNumber}
Applicant: ${application.applicantName}
Address: ${application.projectAddress}
Project Type: ${application.projectType}
Submitted: ${application.submittedDate}

## Compliance Findings (${application.findings.length} items)
${findingsText || "No issues found - this application complies with all NBC 2016 requirements. Prepare a compliance determination and building sanction order for reviewer sign-off."}

## Instructions
Generate a formal notice for municipal plan scrutiny that:
1. Uses official letterhead format with "MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT" header
2. Includes case number, applicant name, address, and date
3. Has a formal salutation
4. Lists each objection/correction item with its NBC 2016 section reference (if corrections needed)
5. Uses bureaucratic but clear statutory language
6. Ends with resubmission instructions (if corrections needed) or examiner compliance determination and building sanction order (if clean)
7. Signs off with "Sincerely, [Plan Reviewer Name], [Title]\nDepartment of Town Planning & Building Sanction"

If there are NO findings, this should be a COMPLIANCE DETERMINATION & BUILDING SANCTION ORDER for human reviewer sign-off, not a correction letter.

Return ONLY valid JSON matching this exact schema:
{
  "applicationId": "${application.id}",
  "letterText": "<full letter text with letterhead, body, and signature>",
  "correctionItemCount": ${application.findings.length}
}

Return only the JSON object, no markdown, no explanation.`;
}

function generateGenericFallbackLetter(application: ReturnType<typeof getApplicationById>): string {
  if (!application) return "Application not found.";

  const hasFindings = application.findings.length > 0;

  if (!hasFindings) {
    return `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT

COMPLIANCE DETERMINATION & BUILDING SANCTION ORDER

Permit Application No.: ${application.caseNumber}
Project Address: ${application.projectAddress}
Applicant: ${application.applicantName}
Date: September 12, 2026

Dear ${application.applicantName.split(" ")[0]},

Your ${application.projectType} application has been scrutinized by department examiners and verified to be in full compliance with the National Building Code of India (NBC 2016) and Municipal Building Bye-Laws. No corrections are required.

Following human plans examiner verification, your building permit is approved for sanction issuance upon payment of applicable municipal fees.

Sincerely,
Chief Building Official
Department of Town Planning & Building Sanction`;
  }

  const itemsText = application.findings
    .map((f, i) => `ITEM ${i + 1} — ${f.issue.toUpperCase()}\n${f.detail}`)
    .join("\n\n");

  return `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION

Permit Application No.: ${application.caseNumber}
Project Address: ${application.projectAddress}
Applicant: ${application.applicantName}
Date of Notice: September 12, 2026

Dear ${application.applicantName.split(" ")[0]},

Your ${application.projectType} application has been scrutinized under NBC 2016. The following corrections are required:

${itemsText}

Please resubmit revised drawings addressing all items above within 30 days of this notice.

Sincerely,
Plan Scrutiny Examiner
Department of Town Planning & Building Sanction`;
}
