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

  return `You are drafting a formal building permit correction letter for Maplewood Township Building Department. Generate a professional correction notice in the style of municipal building departments.

## Application Details
Case Number: ${application.caseNumber}
Applicant: ${application.applicantName}
Address: ${application.projectAddress}
Project Type: ${application.projectType}
Submitted: ${application.submittedDate}

## Compliance Findings (${application.findings.length} items)
${findingsText || "No issues found - this application complies with all requirements. Prepare a compliance determination and permit authorization notice for reviewer sign-off."}

## Instructions
Generate a formal notice for municipal plans examination that:
1. Uses official letterhead format with "MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT" header
2. Includes case number, applicant name, address, and date
3. Has a formal salutation
4. Lists each correction item with its section reference (if corrections needed)
5. Uses bureaucratic but clear language
6. Ends with resubmission instructions (if corrections needed) or examiner compliance determination and permit authorization notice (if clean)
7. Signs off with "Sincerely, [Plan Reviewer Name], [Title]"

If there are NO findings, this should be a COMPLIANCE DETERMINATION & PERMIT AUTHORIZATION NOTICE for human reviewer sign-off, not a correction letter.

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
    return `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT

COMPLIANCE DETERMINATION & PERMIT AUTHORIZATION NOTICE

Permit Application No.: ${application.caseNumber}
Project Address: ${application.projectAddress}
Applicant: ${application.applicantName}
Date: September 12, 2026

Dear ${application.applicantName.split(" ")[0]},

Your ${application.projectType} application has been reviewed by department plans examiners and verified to be in full compliance with all applicable codes and regulations. No corrections are required.

Following human plans examiner verification, your permit application is approved for issuance upon payment of applicable fees.

Sincerely,
Building Official
Maplewood Township Building Department`;
  }

  const itemsText = application.findings
    .map((f, i) => `ITEM ${i + 1} — ${f.issue.toUpperCase()}\n${f.detail}`)
    .join("\n\n");

  return `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: ${application.caseNumber}
Project Address: ${application.projectAddress}
Applicant: ${application.applicantName}
Date of Notice: September 12, 2026

Dear ${application.applicantName.split(" ")[0]},

Your ${application.projectType} application has been reviewed. The following corrections are required:

${itemsText}

Please resubmit revised plans addressing all items above within 30 days of this notice.

Sincerely,
Plan Reviewer
Maplewood Township Building Department`;
}
