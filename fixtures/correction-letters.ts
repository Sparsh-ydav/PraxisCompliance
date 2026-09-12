// Synthetic historical correction letters for Maplewood Township
// 8-10 letters with realistic bureaucratic tone.
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
    projectAddress: "412 Birchwood Lane, Maplewood Township",
    projectType: "Single-family bedroom addition",
    issues: ["egress window dimensions", "sill height"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection
117 Civic Center Drive, Maplewood Township, MT 47201

NOTICE OF PLAN REVIEW CORRECTION — SECOND REVIEW

Permit Application No.: BPR-2023-0041
Project Address: 412 Birchwood Lane
Date of Notice: March 14, 2023
Plan Reviewer: H. Kowalski, CBO

Dear Applicant / Agent of Record,

The above-referenced application has been reviewed and the following corrections are required prior to permit issuance. Please revise and resubmit plans addressing all items below.

ITEM 1 — EGRESS WINDOW DIMENSIONS (Section 101.2)
The bedroom egress window as shown on Sheet A-3 indicates a net clear opening width of 18 inches. The minimum net clear opening width required by Section 101.2 is 20 inches. The proposed window does not comply. Applicant shall revise window specifications to provide a minimum 20-inch net clear opening width. Note: net clear dimensions are taken after deducting frame, sash, and hardware — verify with manufacturer's published specifications.

ITEM 2 — SILL HEIGHT (Section 101.2)
The sill height as dimensioned on Sheet A-3 is 46 inches above finished floor. The maximum permitted sill height for emergency escape openings is 44 inches. Applicant shall lower the rough opening or provide a raised floor platform to bring the sill within the 44-inch maximum.

All other aspects of the submitted plans were found to be in compliance. Revised plans shall be submitted to this office within 30 days of the date of this notice.

Sincerely,
H. Kowalski, Certified Building Official
Maplewood Township Building Department`,
  },
  {
    id: "cl-002",
    caseNumber: "BPR-2023-0089",
    dateIssued: "June 2, 2023",
    projectAddress: "88 Elmwood Drive, Maplewood Township",
    projectType: "Side-yard addition — home office",
    issues: ["side setback — 5.8 ft (waived)", "impervious coverage"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2023-0089
Project Address: 88 Elmwood Drive
Date of Notice: June 2, 2023
Plan Reviewer: M. Okonkwo, Plans Examiner

Dear Applicant,

Your application for a side-yard addition has been reviewed. The following items require your attention.

ITEM 1 — SIDE SETBACK (Section 201.3) — ADMINISTRATIVE WAIVER GRANTED
The submitted survey indicates the proposed addition will be located 5 feet 9.5 inches (5.79 feet) from the southern property line, which is approximately 0.21 feet below the 6-foot minimum required by Section 201.3. Pursuant to Section 201.8, the Building Official has reviewed the submitted certified survey and the encroachment of less than 3 inches (0.21 ft) does not adversely impact the neighboring property. An administrative waiver has been granted for this item. No further action required on setback.

ITEM 2 — IMPERVIOUS SURFACE (Section 201.9)
The as-built calculation submitted with the application indicates total impervious coverage of 38.2% after construction. This is within the 40% maximum. No correction required; informational notation only.

Your application is substantially complete. Upon resubmission demonstrating compliance with any outstanding comments from the Fire Marshal's office, permit issuance will proceed.

M. Okonkwo, Plans Examiner
Maplewood Township Building Department`,
  },
  {
    id: "cl-003",
    caseNumber: "BPR-2023-0134",
    dateIssued: "August 22, 2023",
    projectAddress: "201 Maple Street, Maplewood Township",
    projectType: "Rear addition — master suite",
    issues: ["egress window width at 19.5 inches — flagged despite being close to 20in min"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2023-0134
Project Address: 201 Maple Street
Date of Notice: August 22, 2023
Plan Reviewer: H. Kowalski, CBO

Dear Applicant,

ITEM 1 — EGRESS WINDOW NET CLEAR WIDTH (Section 101.2)
The manufacturer's specification sheet provided for the proposed bedroom window (Andersen 400 Series, Double-Hung) indicates a net clear opening width of 19.5 inches when fully open. This is 0.5 inches below the required 20-inch minimum. This office is aware that some manufacturers list net clear dimensions differently; however, our standard practice is to require strict compliance with the published specification sheet. The applicant shall either: (a) provide a revised specification sheet from the manufacturer confirming net clear width meets or exceeds 20 inches; or (b) substitute a window model with a confirmed compliant net clear opening. We note that this is a common correction for this particular window series.

Please resubmit revised documentation within 21 days.

H. Kowalski, CBO
Maplewood Township Building Department`,
  },
  {
    id: "cl-004",
    caseNumber: "BPR-2023-0198",
    dateIssued: "November 5, 2023",
    projectAddress: "657 Cedar Court, Maplewood Township",
    projectType: "Basement bedroom conversion",
    issues: ["egress window opening area below 5.7 sqft", "window well missing"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION — FIRST REVIEW

Permit Application No.: BPR-2023-0198
Project Address: 657 Cedar Court
Date of Notice: November 5, 2023
Plan Reviewer: T. Reardon, Plans Examiner

Dear Applicant / Contractor,

This office has completed its initial plan review for the proposed basement bedroom conversion at the above address. The following corrections are required:

ITEM 1 — EGRESS OPENING NET CLEAR AREA (Section 101.2)
The proposed basement bedroom window, as shown on Sheet A-2, has a net clear opening height of 23.5 inches and a net clear opening width of 20.5 inches, for a net clear area of 0.341 square feet (approximately 3.35 sq ft when factoring full dimensions). The minimum required net clear area for basement sleeping rooms is 5.7 square feet. The proposed window does not comply. A larger or additional egress opening must be provided.

ITEM 2 — WINDOW WELL REQUIRED (Section 101.7)
As the proposed egress window is below grade, a window well is required. No window well is shown on the submitted plans. Applicant shall add window well details to the plans, including drainage provisions, minimum horizontal projection of 36 inches, and adequate area for the window to fully open.

Two items require correction before this application can proceed. Please resubmit within 30 days.

T. Reardon, Plans Examiner`,
  },
  {
    id: "cl-005",
    caseNumber: "BPR-2024-0012",
    dateIssued: "January 18, 2024",
    projectAddress: "34 Pinewood Way, Maplewood Township",
    projectType: "Second-story addition",
    issues: ["side setback at 5.5 ft — flagged (not waived, over 6-inch threshold)"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2024-0012
Project Address: 34 Pinewood Way
Date of Notice: January 18, 2024
Plan Reviewer: M. Okonkwo, Plans Examiner

Dear Applicant,

ITEM 1 — SIDE SETBACK NON-COMPLIANCE (Section 201.3)
The certified survey submitted with the application indicates the existing structure has a side yard setback of 5 feet 6 inches (5.5 feet) on the eastern property boundary. The proposed second-story addition, being a vertical extension of the existing structure, would maintain this same setback. Section 201.3 requires a minimum side setback of 6 feet. The encroachment of 0.5 feet (6 inches) exceeds the administrative waiver threshold under Section 201.8, which is limited to encroachments not exceeding 6 inches. Therefore, applicant must apply for a formal variance from the Zoning Board of Appeals. Building permit cannot be issued until the variance is granted. Contact the Zoning Division at extension 4421 to schedule a ZBA hearing.

This is the only outstanding item. All other aspects of the application are in order.

M. Okonkwo, Plans Examiner
Maplewood Township Building Department`,
  },
  {
    id: "cl-006",
    caseNumber: "BPR-2024-0067",
    dateIssued: "March 30, 2024",
    projectAddress: "929 Oakdale Avenue, Maplewood Township",
    projectType: "Garage conversion to living space",
    issues: ["hallway egress width 34 inches — below 36 inch minimum"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2024-0067
Project Address: 929 Oakdale Avenue
Date of Notice: March 30, 2024
Plan Reviewer: H. Kowalski, CBO

Dear Applicant,

Your application to convert the attached garage to living space has been reviewed. One correction is required.

ITEM 1 — EGRESS HALLWAY WIDTH (Section 101.5)
The floor plan as submitted shows the new hallway connecting the converted space to the primary exit of the dwelling at a width of 34 inches. Section 101.5 requires a minimum clear hallway width of 36 inches for any egress pathway serving a sleeping room. The proposed hallway is 2 inches below the required minimum. Applicant shall revise the floor plan to provide 36 inches minimum clear width in the egress hallway. Note: this dimension is measured between finished wall surfaces, not studs.

No other corrections are required at this time. Upon resubmission, this application will be re-reviewed within 10 business days.

H. Kowalski, CBO`,
  },
  {
    id: "cl-007",
    caseNumber: "BPR-2024-0112",
    dateIssued: "May 14, 2024",
    projectAddress: "15 Willowbrook Terrace, Maplewood Township",
    projectType: "In-law suite addition",
    issues: ["side setback 5.9 ft — waived (less than 1.2 inches)", "smoke alarm missing"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2024-0112
Project Address: 15 Willowbrook Terrace
Date of Notice: May 14, 2024
Plan Reviewer: T. Reardon, Plans Examiner

Dear Applicant,

ITEM 1 — SIDE SETBACK (Section 201.3) — ADMINISTRATIVE WAIVER GRANTED
Survey indicates proposed addition will be located 5 feet 10.8 inches (5.9 feet) from the northern property line, an encroachment of approximately 1.2 inches below the 6-foot minimum. Per Section 201.8 and consistent with this department's practice for encroachments of less than 6 inches where no adverse impact on adjacent properties is demonstrated, an administrative waiver has been granted. No further action required.

ITEM 2 — SMOKE ALARM — NEW SLEEPING ROOM (Section 101.9)
The plans do not indicate the location of smoke alarms in the new in-law suite sleeping room or the interconnection plan for the existing dwelling. Section 101.9 requires interconnected smoke alarms in all sleeping rooms and on all floors when a new sleeping room is created. Applicant shall add smoke alarm locations and interconnection wiring diagram to Sheet E-1.

One correction remains. Please resubmit within 21 days.

T. Reardon, Plans Examiner`,
  },
  {
    id: "cl-008",
    caseNumber: "BPR-2024-0156",
    dateIssued: "July 8, 2024",
    projectAddress: "73 Ferndale Drive, Maplewood Township",
    projectType: "Rear bedroom addition",
    issues: ["egress window sill height 45 inches — flagged", "rear setback compliant but close"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2024-0156
Project Address: 73 Ferndale Drive
Date of Notice: July 8, 2024
Plan Reviewer: M. Okonkwo, Plans Examiner

Dear Applicant,

ITEM 1 — EGRESS WINDOW SILL HEIGHT (Section 101.2)
Sheet A-4 indicates the finished floor-to-sill dimension for the proposed bedroom egress window is 45 inches. The maximum permitted sill height for emergency escape and rescue openings is 44 inches per Section 101.2. The 1-inch exceedance requires correction. Applicant may (a) lower the rough sill by a minimum of 1 inch in the framing, or (b) raise the finished floor level if structurally feasible.

INFORMATIONAL NOTE — REAR SETBACK
The rear setback as measured from the certified survey is 25.3 feet. This is compliant with the 25-foot minimum required by Section 201.4, however we note this is a narrow margin. Applicant is advised that any future addition or structure in the rear yard would likely trigger a variance. This item does not require correction but is noted for the record.

One correction required. Please resubmit.

M. Okonkwo, Plans Examiner`,
  },
  {
    id: "cl-009",
    caseNumber: "BPR-2024-0203",
    dateIssued: "September 3, 2024",
    projectAddress: "516 Chestnut Boulevard, Maplewood Township",
    projectType: "Master bedroom expansion",
    issues: ["primary exit door width 30 inches — below 32-inch minimum"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION

Permit Application No.: BPR-2024-0203
Project Address: 516 Chestnut Boulevard
Date of Notice: September 3, 2024
Plan Reviewer: H. Kowalski, CBO

Dear Applicant,

ITEM 1 — PRIMARY EXIT DOOR WIDTH (Section 101.4)
The proposed door schedule on Sheet A-5 indicates the primary exterior door (Door D-1) to be a 2'-6" (30-inch) pre-hung unit. Section 101.4 requires the primary exit door to have a minimum clear opening width of 32 inches. The proposed 30-inch door provides approximately 27.5 to 28 inches of clear opening width after accounting for the door stop and frame, which does not meet the minimum. Applicant shall revise the door schedule to specify a minimum 3'-0" (36-inch) pre-hung exterior door, which will provide a compliant clear opening width.

All other aspects of the submission are in compliance. Upon correction, permit issuance will not be delayed.

H. Kowalski, CBO`,
  },
  {
    id: "cl-010",
    caseNumber: "BPR-2024-0251",
    dateIssued: "October 21, 2024",
    projectAddress: "840 Laurelwood Circle, Maplewood Township",
    projectType: "Detached garage with loft",
    issues: ["side setback 4.8 ft — formal variance required", "accessory structure height"],
    letterText: `MAPLEWOOD TOWNSHIP BUILDING DEPARTMENT
Office of Plan Review and Inspection

NOTICE OF PLAN REVIEW CORRECTION — FIRST REVIEW

Permit Application No.: BPR-2024-0251
Project Address: 840 Laurelwood Circle
Date of Notice: October 21, 2024
Plan Reviewer: T. Reardon, Plans Examiner

Dear Applicant,

ITEM 1 — ACCESSORY STRUCTURE SIDE SETBACK (Section 201.6 and 201.3)
The site plan indicates the proposed detached garage is to be located 4 feet 9.6 inches (4.8 feet) from the western property line. The proposed structure includes a loft with habitable space exceeding 200 square feet of floor area. Per Section 201.6, accessory structures with floor area over 200 square feet must comply with primary structure setback requirements, which in the R-1 district requires a 6-foot minimum side setback per Section 201.3. The encroachment of 1.2 feet (14.4 inches) substantially exceeds the 6-inch administrative waiver threshold. A formal variance application to the Zoning Board of Appeals is required prior to permit issuance.

ITEM 2 — ACCESSORY STRUCTURE HEIGHT
The ridge height of the proposed garage as shown on Sheet A-2 is 22 feet 6 inches above average grade. Per Section 201.10, this is within the 35-foot primary structure limit; however, the Township's accessory structure height limitation (Appendix B, Section B-4) restricts detached accessory structures to a maximum height of 18 feet. Applicant shall revise the roof pitch or overall structure height to comply with the 18-foot maximum.

Two corrections required before this application can proceed.

T. Reardon, Plans Examiner
Maplewood Township Building Department`,
  },
];
