// Fallback correction letters for the Reviewer Dashboard
// These are returned when the LLM is unavailable for the correction-drafter agent
// All citations standardized to National Building Code of India (NBC 2016).

export const FALLBACK_LETTERS: Record<string, string> = {
  "qa-001": `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Chief Town Planner & Building Sanction
Civil Lines, Municipal Headquarters

NOTICE OF PLAN SCRUTINY OBJECTION & CORRECTION

Building Permit Application No.: BPR-2026-0412
Project Address: 847 Oakwood Drive
Applicant: Jennifer Martinez
Date of Notice: September 12, 2026
Plan Examiner: H. Kowalski, Chief Building Official / Municipal Engineer

Dear Ms. Martinez,

Your application for a basement habitable room conversion has been scrutinized under the National Building Code of India (NBC 2016). The following corrections are required prior to sanction issuance:

ITEM 1 — EGRESS WINDOW CLEAR WIDTH (NBC 2016 Part 4, Clause 4.10)
The basement habitable room egress window width is 406 mm (16 inches). The minimum net clear opening width required by NBC 2016 Part 4, Clause 4.10 & Part 8 Sec 1, Clause 9.11.2 is 500 mm (20 inches). The proposed opening does not comply. Please revise window schedule to provide compliant clear width.

ITEM 2 — EGRESS WINDOW CLEAR HEIGHT (NBC 2016 Part 4, Clause 4.10)
The egress window clear height is 558 mm (22 inches). The minimum net clear opening height required is 600 mm (24 inches) per NBC 2016 Part 4, Clause 4.10. Please specify a compliant window sash.

ITEM 3 — SILL HEIGHT EXCEEDANCE (NBC 2016 Part 4, Clause 4.10.1)
The sill height above finished floor is 1270 mm (50 inches). The maximum permitted sill height is 1100 mm (44 inches). Please lower the masonry opening or construct a permanent step to bring effective sill within the 1100 mm maximum.

ITEM 4 — SMOKE & HEAT DETECTION SCHEMATIC (NBC 2016 Part 4, Clause 4.17 & Table 7)
No smoke/heat alarm layout or interconnection schematic has been provided. All habitable sleeping rooms require interconnected detection complying with NBC 2016 Part 4 Table 7. Please upload Sheet E-2.

Please resubmit revised drawings addressing all items above within 30 days of this notice.

Sincerely,
H. Kowalski, Chief Building Official
Department of Town Planning & Building Sanction`,

  "qa-002": `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Chief Town Planner & Building Sanction

NOTICE OF PLAN SCRUTINY OBJECTION & CORRECTION

Building Permit Application No.: BPR-2026-0419
Project Address: 1205 Maple Street
Applicant: David Chen
Date of Notice: September 12, 2026
Plan Examiner: M. Okonkwo, Assistant Town Planner

Dear Mr. Chen,

Your basement habitable room addition application requires the following statutory corrections under NBC 2016:

ITEM 1 — EGRESS OPENING DIMENSIONS (NBC 2016 Part 4, Clause 4.10)
The proposed egress window does not meet minimum dimension requirements (width: 406 mm / 16" vs 500 mm / 20" required; height: 558 mm / 22" vs 600 mm / 24" required). Please specify a compliant opening.

ITEM 2 — SILL HEIGHT LIMITATION (NBC 2016 Part 4, Clause 4.10.1)
Sill height of 1270 mm (50 inches) exceeds the 1100 mm (44-inch) maximum. Structural revision or step required.

ITEM 3 — BELOW-GRADE WINDOW WELL CLEARANCE (NBC 2016 Part 4, Clause 4.10.3)
As the egress opening is below grade, a window well with minimum 900 mm (36-inch) horizontal projection is required. Please incorporate window well engineering details.

ITEM 4 — DETECTION PLAN MISSING (NBC 2016 Part 4, Clause 4.17 & Table 7)
Interconnected smoke/heat detection layout required for new habitable room. Please provide layout.

Resubmit revised drawings within 30 days.

M. Okonkwo, Assistant Town Planner
Department of Town Planning & Building Sanction`,

  "qa-003": `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT

NOTICE OF PLAN SCRUTINY OBJECTION & CORRECTION

Building Permit Application No.: BPR-2026-0423
Project Address: 632 Cedar Lane
Applicant: Sarah Thompson
Date of Notice: September 12, 2026
Plan Examiner: T. Reardon, Executive Engineer

Dear Ms. Thompson,

Your residential conversion application has been reviewed under NBC 2016. Three corrections are required:

ITEM 1 — EGRESS OPENING WIDTH (NBC 2016 Part 4, Clause 4.10)
Net clear opening width of 406 mm (16 inches) does not meet the 500 mm (20-inch) minimum. Please specify a compliant window model.

ITEM 2 — EGRESS OPENING HEIGHT (NBC 2016 Part 4, Clause 4.10)
Net clear opening height of 558 mm (22 inches) is below the 600 mm (24-inch) minimum requirement.

ITEM 3 — SILL HEIGHT EXCEEDS MAXIMUM (NBC 2016 Part 4, Clause 4.10.1)
The 1270 mm (50-inch) sill height exceeds the 1100 mm (44-inch) maximum allowed by Clause 4.10.1.

Please resubmit with corrections within 30 days.

T. Reardon, Executive Engineer
Department of Town Planning & Building Sanction`,

  "qa-004": `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT

NOTICE OF PLAN SCRUTINY OBJECTION & CORRECTION

Building Permit Application No.: BPR-2026-0427
Project Address: 423 Birchwood Circle
Applicant: Michael Johnson
Date of Notice: September 12, 2026
Plan Examiner: M. Okonkwo, Assistant Town Planner

Dear Mr. Johnson,

Your kitchen side addition application has been reviewed with one advisory item under NBC 2016:

ITEM 1 — SIDE OPEN SPACE (NBC 2016 Part 3, Clause 8.2.3) — ADMINISTRATIVE WAIVER AVAILABLE
The side open space measures 1.73 m (5.67 ft / 5 ft 8 inches), which is approximately 100 mm (4 inches) below the 1.8 m (6.0-ft) minimum. Per NBC 2016 Part 2, Clause 12.5, an administrative waiver may be granted for minor deviations under 150 mm (6 inches) with a licensed surveyor site plan. Please submit Form B-1 and registered demarcation with your resubmission.

All other aspects of the application comply with NBC 2016. Upon resubmission with survey, this application will proceed to sanction issuance.

M. Okonkwo, Assistant Town Planner
Department of Town Planning & Building Sanction`,

  "qa-005": `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT

NOTICE OF PLAN SCRUTINY OBJECTION & CORRECTION

Building Permit Application No.: BPR-2026-0431
Project Address: 789 Elmwood Avenue
Applicant: Patricia O'Brien
Date of Notice: September 12, 2026
Plan Examiner: H. Kowalski, Chief Building Official

Dear Ms. O'Brien,

Your side-yard addition has been reviewed under NBC 2016. One advisory item requires attention:

ITEM 1 — SIDE OPEN SPACE ENCROACHMENT (NBC 2016 Part 3, Clause 8.2.3)
Side open space is 1.73 m (5.67 ft), approximately 100 mm (4 inches) below the required 1.8 m (6.0 ft). An administrative waiver under NBC 2016 Part 2, Clause 12.5 is available for this minor deviation. Please submit registered site demarcation and Form B-1.

No other corrections required. Sanction will proceed upon receipt of surveyor demarcation.

H. Kowalski, Chief Building Official
Department of Town Planning & Building Sanction`,

  "qa-006": `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT

NOTICE OF PLAN SCRUTINY OBJECTION & CORRECTION

Building Permit Application No.: BPR-2026-0435
Project Address: 1567 Willow Lane
Applicant: Robert Kim
Date of Notice: September 12, 2026
Plan Examiner: T. Reardon, Executive Engineer

Dear Mr. Kim,

ITEM 1 — SIDE OPEN SPACE (NBC 2016 Part 3, Clause 8.2.3)
The garage expansion has a side open space of 1.73 m (5.67 ft), below the 1.8 m requirement by approximately 100 mm (4 inches). Administrative waiver available per NBC 2016 Part 2, Clause 12.5 with registered surveyor plan.

Please resubmit with site survey.

T. Reardon, Executive Engineer
Department of Town Planning & Building Sanction`,

  "qa-007": `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT

COMPLIANCE DETERMINATION & BUILDING SANCTION ORDER

Building Permit Application No.: BPR-2026-0438
Project Address: 234 Pine Street
Applicant: Lisa Anderson
Date: September 12, 2026
Plan Examiner: H. Kowalski, Chief Building Official

Dear Ms. Anderson,

Your residential addition application has been scrutinized by town planning examiners and determined to be in full compliance with the National Building Code of India (NBC 2016) and Municipal Building Bye-Laws. No corrections are required.

Following reviewer verification, your building permit is approved for sanction issuance upon payment of statutory development fees.

H. Kowalski, Chief Building Official
Department of Town Planning & Building Sanction`,

  "qa-008": `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT

COMPLIANCE DETERMINATION & BUILDING SANCTION ORDER

Building Permit Application No.: BPR-2026-0442
Project Address: 956 Chestnut Boulevard
Applicant: James Wilson
Date: September 12, 2026
Plan Examiner: M. Okonkwo, Assistant Town Planner

Dear Mr. Wilson,

Your rear addition application has been scrutinized and verified in full compliance with NBC 2016 Part 3 (Development Control) and Part 4 (Fire and Life Safety). No objections or corrections required. Sanction approved pending fee clearance.

M. Okonkwo, Assistant Town Planner
Department of Town Planning & Building Sanction`,

  "qa-009": `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT

COMPLIANCE DETERMINATION & BUILDING SANCTION ORDER

Building Permit Application No.: BPR-2026-0445
Project Address: 1842 Ferndale Drive
Applicant: Emily Rodriguez
Date: September 12, 2026
Plan Examiner: T. Reardon, Executive Engineer

Dear Ms. Rodriguez,

Your home office addition has been reviewed and verified by town planning staff. All NBC 2016 requirements are satisfied. The building sanction is approved for issuance by the undersigned reviewer.

T. Reardon, Executive Engineer
Department of Town Planning & Building Sanction`,
};
