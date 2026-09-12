// Fallback correction letters for the Reviewer Dashboard
// These are returned when the LLM is unavailable for the correction-drafter agent

export const FALLBACK_LETTERS: Record<string, string> = {
  "qa-001": `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection
117 Civic Center Drive, Maplewood Township, MT 47201

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2026-0412
Project Address: 847 Oakwood Drive
Applicant: Jennifer Martinez
Date of Notice: September 12, 2026
Plan Reviewer: H. Kowalski, CBO

Dear Ms. Martinez,

Your application for a basement bedroom conversion has been reviewed. The following corrections are required prior to permit issuance:

ITEM 1 — EGRESS WINDOW WIDTH (Section 101.2)
The basement bedroom egress window width is 16 inches. The minimum net clear opening width required is 20 inches. The proposed window does not comply. Please revise to provide a compliant egress opening.

ITEM 2 — EGRESS WINDOW HEIGHT (Section 101.2)
The egress window height is 22 inches. The minimum net clear opening height required is 24 inches. Please specify a window that meets the minimum height requirement.

ITEM 3 — WINDOW SILL HEIGHT (Section 101.2)
The sill height above finished floor is 50 inches. The maximum permitted sill height is 44 inches. Please lower the rough opening or provide a raised floor platform to bring the sill within the 44-inch maximum.

ITEM 4 — SMOKE ALARM DOCUMENTATION (Section 101.9)
No smoke alarm location plan or interconnection wiring diagram has been provided. All new sleeping rooms require interconnected smoke alarms. Please add smoke alarm locations to your plans.

Please resubmit revised plans addressing all items above within 30 days of this notice.

Sincerely,
H. Kowalski, Certified Building Official
Maplewood Township Building Department`,

  "qa-002": `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2026-0419
Project Address: 1205 Maple Street
Applicant: David Chen
Date of Notice: September 12, 2026

Dear Mr. Chen,

Your basement bedroom addition application requires the following corrections:

ITEM 1 — EGRESS OPENING DIMENSIONS (Section 101.2)
The proposed egress window does not meet minimum dimension requirements (width: 16" vs 20" required, height: 22" vs 24" required). Please specify a compliant window.

ITEM 2 — SILL HEIGHT VIOLATION (Section 101.2)
Sill height of 50 inches exceeds the 44-inch maximum. Correction required.

ITEM 3 — WINDOW WELL REQUIRED (Section 101.7)
As the egress window is below grade, a window well with minimum 36-inch horizontal projection is required. Please add window well details to plans.

ITEM 4 — SMOKE ALARM PLAN MISSING (Section 101.9)
Interconnected smoke alarm plan required for new sleeping room. Please provide.

Resubmit within 30 days.

M. Okonkwo, Plans Examiner`,

  "qa-003": `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2026-0423
Project Address: 632 Cedar Lane
Applicant: Sarah Thompson
Date of Notice: September 12, 2026

Dear Ms. Thompson,

Your in-law suite conversion application has been reviewed. Three corrections are required:

ITEM 1 — EGRESS WINDOW WIDTH (Section 101.2)
Net clear opening width of 16 inches does not meet the 20-inch minimum. Please specify a compliant window model.

ITEM 2 — EGRESS WINDOW HEIGHT (Section 101.2)
Net clear opening height of 22 inches is below the 24-inch minimum requirement.

ITEM 3 — SILL HEIGHT EXCEEDS MAXIMUM (Section 101.2)
The 50-inch sill height exceeds the 44-inch maximum allowed by Section 101.2.

Please resubmit with corrections within 30 days.

T. Reardon, Plans Examiner`,

  "qa-004": `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2026-0427
Project Address: 423 Birchwood Circle
Applicant: Michael Johnson
Date of Notice: September 12, 2026

Dear Mr. Johnson,

Your kitchen side addition application has been reviewed with one advisory item:

ITEM 1 — SIDE SETBACK (Section 201.3) — ADMINISTRATIVE WAIVER AVAILABLE
The side setback measures 5 feet 8 inches (5.67 ft), which is approximately 4 inches below the 6-foot minimum. Per Section 201.8, an administrative waiver may be granted for encroachments under 6 inches with a certified survey. Please include a certified survey with your resubmission and note your request for administrative waiver in the cover letter.

All other aspects of the application are in compliance. Upon resubmission with survey, this application will proceed to permit issuance.

M. Okonkwo, Plans Examiner`,

  "qa-005": `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2026-0431
Project Address: 789 Elmwood Avenue
Applicant: Patricia O'Brien
Date of Notice: September 12, 2026

Dear Ms. O'Brien,

Your side-yard addition has been reviewed. One advisory item requires attention:

ITEM 1 — SIDE SETBACK ENCROACHMENT (Section 201.3)
Side setback is 5.67 feet, approximately 4 inches below the required 6 feet. An administrative waiver under Section 201.8 is available for this minor encroachment. Please submit a certified survey and request the waiver.

No other corrections required. Permit issuance will proceed upon receipt of survey.

H. Kowalski, CBO`,

  "qa-006": `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2026-0435
Project Address: 1567 Willow Lane
Applicant: Robert Kim
Date of Notice: September 12, 2026

Dear Mr. Kim,

ITEM 1 — SIDE SETBACK (Section 201.3)
The garage expansion has a side setback of 5.67 feet, below the 6-foot requirement by approximately 4 inches. Administrative waiver available per Section 201.8 with certified survey.

Please resubmit with survey.

T. Reardon, Plans Examiner`,

  "qa-007": `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT

APPROVAL NOTICE

Permit Application No.: BPR-2026-0438
Project Address: 234 Pine Street
Applicant: Lisa Anderson
Date: September 12, 2026

Dear Ms. Anderson,

Your master bedroom addition application has been reviewed and found to be in full compliance with all applicable codes and regulations. No corrections are required.

Your permit is approved and will be issued upon payment of applicable fees.

H. Kowalski, CBO`,

  "qa-008": `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT

APPROVAL NOTICE

Permit Application No.: BPR-2026-0442
Project Address: 956 Chestnut Boulevard
Applicant: James Wilson
Date: September 12, 2026

Dear Mr. Wilson,

Your rear addition application is in full compliance. No corrections required. Permit approved pending fee payment.

M. Okonkwo, Plans Examiner`,

  "qa-009": `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT

APPROVAL NOTICE

Permit Application No.: BPR-2026-0445
Project Address: 1842 Ferndale Drive
Applicant: Emily Rodriguez
Date: September 12, 2026

Dear Ms. Rodriguez,

Your home office addition has been reviewed and approved. All requirements met. Permit ready for issuance.

T. Reardon, Plans Examiner`,
};
