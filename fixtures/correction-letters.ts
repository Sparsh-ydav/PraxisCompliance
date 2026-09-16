// Synthetic historical correction letters for Municipal Town Planning & Building Sanction
// Standardized to National Building Code of India (NBC 2016)
// 10 letters with realistic bureaucratic scrutiny tone.
// Several contain "code says X, reviewers enforce Y" quirks for the Pattern Agent to detect.

export interface CorrectionLetter {
  id: string;
  caseNumber: string;
  dateIssued: string;
  projectAddress: string;
  projectType: string;
  issues: string[];
  letterText: string;
}

export const CORRECTION_LETTERS: CorrectionLetter[] = [
  {
    id: "cl-001",
    caseNumber: "BPR-2023-0041",
    dateIssued: "March 14, 2023",
    projectAddress: "412 Birchwood Lane, Civil Lines",
    projectType: "Single-family habitable bedroom addition",
    issues: ["egress window dimensions", "sill height"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction
117 Civic Center Drive, Municipal Administrative Complex

NOTICE OF PLAN SCRUTINY CORRECTION — SECOND REVIEW

Permit Application No.: BPR-2023-0041
Project Address: 412 Birchwood Lane
Date of Notice: March 14, 2023
Plan Reviewer: H. Kowalski, Chief Building Official

Dear Applicant / Licensed Architect,

The above-referenced application has been scrutinized and the following corrections are required under the National Building Code of India (NBC 2016) prior to building permit sanction. Please resubmit drawings addressing all items below.

ITEM 1 — EGRESS WINDOW CLEAR WIDTH (NBC 2016 Part 4, Clause 4.10 & Part 8 Sec 1, Clause 9.11.2)
The bedroom egress window as shown on Sheet A-3 indicates a net clear opening width of 457 mm (18 inches). The minimum net clear opening width required by NBC 2016 Part 4, Clause 4.10 is 500 mm (20 inches). The proposed window does not comply. Applicant shall revise window specifications to provide a minimum 500 mm (20-inch) net clear opening width. Note: net clear dimensions are taken after deducting frame, sash, and hardware — verify with manufacturer's published test certificates.

ITEM 2 — SILL HEIGHT LIMITATION (NBC 2016 Part 4, Clause 4.10.1)
The sill height as dimensioned on Sheet A-3 is 1168 mm (46 inches) above finished floor level. The maximum permitted sill height for emergency escape openings is 1100 mm (44 inches / 1.1 m). Applicant shall lower the masonry opening or provide a raised floor step to bring the effective sill within the 1100 mm maximum.

All other aspects of the submitted plans comply with NBC 2016. Revised plans shall be submitted within 30 days of the date of this notice.

Sincerely,
H. Kowalski, Chief Building Official
Department of Town Planning & Building Sanction`,
  },
  {
    id: "cl-002",
    caseNumber: "BPR-2023-0089",
    dateIssued: "June 2, 2023",
    projectAddress: "88 Elmwood Drive, Civil Lines",
    projectType: "Side-yard addition — home office",
    issues: ["side setback — 5.8 ft (waived)", "ground coverage"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION

Permit Application No.: BPR-2023-0089
Project Address: 88 Elmwood Drive
Date of Notice: June 2, 2023
Plan Reviewer: M. Okonkwo, Assistant Town Planner

Dear Applicant,

Your application for a side-yard addition has been scrutinized under NBC 2016 Part 3 (Development Control). The following items require your attention.

ITEM 1 — SIDE OPEN SPACE (NBC 2016 Part 3, Clause 8.2.3) — ADMINISTRATIVE WAIVER GRANTED
The submitted survey indicates the proposed addition will be located 1.76 m (5 feet 9.5 inches / 5.79 feet) from the southern property boundary, which is approximately 64 mm (0.21 feet) below the 1.8 m (6.0-foot) minimum required by NBC 2016 Part 3, Clause 8.2.3. Pursuant to NBC 2016 Part 2, Clause 12.5, the Chief Building Official has reviewed the registered survey and determined this deviation of less than 150 mm (6 inches) does not adversely impact light, ventilation, or firefighting access. An administrative waiver has been granted. No further action required on side open space.

ITEM 2 — MAXIMUM GROUND COVERAGE (NBC 2016 Part 3, Clause 6.1 & Table 1)
The ground coverage calculation indicates total building footprint coverage of 38.2% after construction. This is within the 40% maximum. No correction required; informational notation only.

Your application is substantially complete. Building permit sanction will proceed upon final administrative clearance.

M. Okonkwo, Assistant Town Planner
Department of Town Planning & Building Sanction`,
  },
  {
    id: "cl-003",
    caseNumber: "BPR-2023-0134",
    dateIssued: "August 22, 2023",
    projectAddress: "201 Maple Street, Civil Lines",
    projectType: "Rear addition — master suite",
    issues: ["egress window width at 495 mm (19.5 inches) — strictly flagged"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION

Permit Application No.: BPR-2023-0134
Project Address: 201 Maple Street
Date of Notice: August 22, 2023
Plan Reviewer: H. Kowalski, Chief Building Official

Dear Applicant,

ITEM 1 — EGRESS WINDOW NET CLEAR WIDTH (NBC 2016 Part 4, Clause 4.10)
The manufacturer's specification sheet provided for the proposed bedroom window indicates a net clear opening width of 495 mm (19.5 inches) when fully open. This is 5 mm (0.5 inches) below the required 500 mm (20-inch) minimum under NBC 2016 Part 4, Clause 4.10. This office strictly enforces the 500 mm standard without rounding. The applicant shall: (a) provide a revised manufacturer cut sheet confirming net clear width meets or exceeds 500 mm; or (b) substitute a window model with verified compliant net clear opening.

Please resubmit revised documentation within 21 days.

H. Kowalski, Chief Building Official
Department of Town Planning & Building Sanction`,
  },
  {
    id: "cl-004",
    caseNumber: "BPR-2023-0198",
    dateIssued: "November 5, 2023",
    projectAddress: "657 Cedar Court, Civil Lines",
    projectType: "Basement habitable room conversion",
    issues: ["egress window opening area below 0.53 sq m (5.7 sqft)", "window well missing"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION — FIRST REVIEW

Permit Application No.: BPR-2023-0198
Project Address: 657 Cedar Court
Date of Notice: November 5, 2023
Plan Reviewer: T. Reardon, Executive Engineer

Dear Applicant / Architect of Record,

This office has completed its initial plan scrutiny for the proposed basement habitable room conversion. The following corrections are required under NBC 2016:

ITEM 1 — EGRESS OPENING NET CLEAR AREA (NBC 2016 Part 4, Clause 4.10)
The proposed basement bedroom window, as shown on Sheet A-2, has a net clear opening height of 596 mm (23.5 inches) and width of 520 mm (20.5 inches), yielding a net clear area of 0.31 m² (3.35 sq ft). The minimum required net clear area for basement habitable sleeping rooms is 0.53 m² (5.7 sq ft). The proposed window does not comply. A larger or additional emergency escape opening must be provided.

ITEM 2 — WINDOW WELL CLEARANCE REQUIRED (NBC 2016 Part 4, Clause 4.10.3 & Part 3, Clause 8.2.6)
As the proposed escape window is below grade, a window well is required. No window well is detailed on the submitted plans. Applicant shall incorporate window well details, including drainage, minimum horizontal projection of 900 mm (36 inches), and full opening swing clearance.

Two items require correction before sanction can proceed. Please resubmit within 30 days.

T. Reardon, Executive Engineer
Department of Town Planning & Building Sanction`,
  },
  {
    id: "cl-005",
    caseNumber: "BPR-2024-0012",
    dateIssued: "January 18, 2024",
    projectAddress: "34 Pinewood Way, Civil Lines",
    projectType: "Second-story vertical addition",
    issues: ["side setback at 5.5 ft — flagged (exceeds 150 mm waiver threshold)"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION

Permit Application No.: BPR-2024-0012
Project Address: 34 Pinewood Way
Date of Notice: January 18, 2024
Plan Reviewer: M. Okonkwo, Assistant Town Planner

Dear Applicant,

ITEM 1 — SIDE OPEN SPACE NON-COMPLIANCE (NBC 2016 Part 3, Clause 8.2.3 & Part 2, Clause 12.5)
The certified survey submitted indicates the existing structure has a side yard setback of 1.68 m (5 feet 6 inches / 5.5 feet) on the eastern boundary. The proposed second-story addition maintains this same setback. NBC 2016 Part 3, Clause 8.2.3 requires a minimum side open space of 1.8 m (6.0 feet). The encroachment of 120 mm (6 inches) exceeds the administrative waiver threshold under NBC 2016 Part 2, Clause 12.5. Therefore, applicant must apply for a formal variance from the Municipal Planning Authority. Building sanction cannot be released until the variance is sanctioned.

M. Okonkwo, Assistant Town Planner
Department of Town Planning & Building Sanction`,
  },
  {
    id: "cl-006",
    caseNumber: "BPR-2024-0067",
    dateIssued: "March 30, 2024",
    projectAddress: "929 Oakdale Avenue, Civil Lines",
    projectType: "Outhouse conversion to living space",
    issues: ["corridor egress width 863 mm (34 inches) — below 1000 mm minimum"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION

Permit Application No.: BPR-2024-0067
Project Address: 929 Oakdale Avenue
Date of Notice: March 30, 2024
Plan Reviewer: H. Kowalski, Chief Building Official

Dear Applicant,

ITEM 1 — EGRESS CORRIDOR WIDTH (NBC 2016 Part 4, Clause 4.5.1)
The floor plan shows the internal corridor connecting the converted space to the primary exit at a width of 863 mm (34 inches). NBC 2016 Part 4, Clause 4.5.1 requires a minimum clear passageway width of 1000 mm (1.0 m / 39.4 inches) for any egress pathway serving residential habitable rooms. The proposed corridor is 137 mm below the required minimum. Applicant shall revise the plan to provide 1000 mm minimum clear width between finished plaster/masonry surfaces.

H. Kowalski, Chief Building Official
Department of Town Planning & Building Sanction`,
  },
  {
    id: "cl-007",
    caseNumber: "BPR-2024-0112",
    dateIssued: "May 14, 2024",
    projectAddress: "15 Willowbrook Terrace, Civil Lines",
    projectType: "In-law suite residential addition",
    issues: ["side setback 5.9 ft — waived", "smoke alarm layout missing"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION

Permit Application No.: BPR-2024-0112
Project Address: 15 Willowbrook Terrace
Date of Notice: May 14, 2024
Plan Reviewer: T. Reardon, Executive Engineer

Dear Applicant,

ITEM 1 — SIDE OPEN SPACE (NBC 2016 Part 3, Clause 8.2.3) — ADMINISTRATIVE WAIVER GRANTED
Demarcation survey indicates proposed addition will be located 1.80 m (5.9 feet) from the northern property line, an encroachment of approximately 30 mm (1.2 inches) below the 1.8 m minimum. Per NBC 2016 Part 2, Clause 12.5, an administrative waiver has been granted. No further action required on open space.

ITEM 2 — SMOKE & HEAT DETECTION LAYOUT (NBC 2016 Part 4, Clause 4.17 & Table 7)
The drawings do not indicate the location of interconnected smoke/heat detectors in the new suite or interconnection with existing detectors. NBC 2016 Part 4 Table 7 mandates interconnected detection in all sleeping rooms and circulation corridors. Applicant shall add detection schematic Sheet E-1.

T. Reardon, Executive Engineer
Department of Town Planning & Building Sanction`,
  },
  {
    id: "cl-008",
    caseNumber: "BPR-2024-0156",
    dateIssued: "July 8, 2024",
    projectAddress: "73 Ferndale Drive, Civil Lines",
    projectType: "Rear bedroom addition",
    issues: ["egress window sill height 1143 mm (45 inches) — flagged", "rear setback near-miss"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION

Permit Application No.: BPR-2024-0156
Project Address: 73 Ferndale Drive
Date of Notice: July 8, 2024
Plan Reviewer: M. Okonkwo, Assistant Town Planner

Dear Applicant,

ITEM 1 — EGRESS SILL HEIGHT LIMITATION (NBC 2016 Part 4, Clause 4.10.1)
Sheet A-4 indicates the finished floor-to-sill dimension for the proposed bedroom egress window is 1143 mm (45 inches). The maximum permitted sill height for emergency escape openings is 1100 mm (44 inches) per NBC 2016 Part 4, Clause 4.10.1. The 43 mm exceedance requires correction. Applicant may lower the rough opening or construct a permanent step.

INFORMATIONAL NOTE — REAR OPEN SPACE (NBC 2016 Part 3, Clause 8.2.2)
The rear open space as measured from the survey is 7.71 m (25.3 feet). This satisfies the 7.5 m (25-foot) minimum required by NBC 2016 Part 3, Clause 8.2.2. Applicant is advised that any future addition would trigger open space variance. Noted for the record without delaying sanction.

M. Okonkwo, Assistant Town Planner
Department of Town Planning & Building Sanction`,
  },
  {
    id: "cl-009",
    caseNumber: "BPR-2024-0203",
    dateIssued: "September 3, 2024",
    projectAddress: "516 Chestnut Boulevard, Civil Lines",
    projectType: "Master bedroom expansion",
    issues: ["primary exit door width 762 mm (30 inches) — below 1000 mm minimum"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION

Permit Application No.: BPR-2024-0203
Project Address: 516 Chestnut Boulevard
Date of Notice: September 3, 2024
Plan Reviewer: H. Kowalski, Chief Building Official

Dear Applicant,

ITEM 1 — PRIMARY EXIT DOOR CLEAR WIDTH (NBC 2016 Part 4, Clause 4.4.2)
The proposed door schedule on Sheet A-5 indicates the primary exterior door (Door D-1) to be 762 mm (30 inches / 2'-6") wide. NBC 2016 Part 4, Clause 4.4.2 requires the primary exit door to have a minimum clear opening width of 1000 mm (1.0 m / 3.3 ft). The proposed door provides only ~700 mm clear opening after accounting for frame rebates. Applicant shall revise the door schedule to specify a minimum 1000 mm clear opening doorway.

H. Kowalski, Chief Building Official
Department of Town Planning & Building Sanction`,
  },
  {
    id: "cl-010",
    caseNumber: "BPR-2024-0251",
    dateIssued: "October 21, 2024",
    projectAddress: "840 Laurelwood Circle, Civil Lines",
    projectType: "Detached garage with habitable loft",
    issues: ["accessory structure side setback — formal variance required", "structure height"],
    letterText: `MUNICIPAL CORPORATION TOWN PLANNING & BUILDING SANCTION DEPARTMENT
Office of Plan Scrutiny & Building Sanction

NOTICE OF PLAN SCRUTINY CORRECTION — FIRST REVIEW

Permit Application No.: BPR-2024-0251
Project Address: 840 Laurelwood Circle
Date of Notice: October 21, 2024
Plan Reviewer: T. Reardon, Executive Engineer

Dear Applicant,

ITEM 1 — ACCESSORY STRUCTURE SIDE OPEN SPACE (NBC 2016 Part 3, Clause 8.2.5 and 8.2.3)
The site plan indicates the proposed detached structure is to be located 1.46 m (4.8 feet) from the western property line. The structure includes habitable space exceeding 25 m² of floor area. Per NBC 2016 Part 3, Clause 8.2.5, habitable accessory structures must comply with primary structure side open space requirements (1.8 m / 6.0 ft per Clause 8.2.3). The encroachment of 340 mm exceeds the administrative waiver threshold. A formal variance application to the Municipal Planning Authority is required.

ITEM 2 — ACCESSORY BUILDING HEIGHT (NBC 2016 Part 3, Clause 8.3)
The ridge height of the proposed garage is 6.85 m (22.5 ft). While within the 10.5 m (35-ft) primary structure limit under Clause 8.3, municipal accessory structure bylaws limit detached outbuildings to 5.5 m (18 ft). Applicant shall adjust roof pitch to comply.

T. Reardon, Executive Engineer
Department of Town Planning & Building Sanction`,
  },
];
