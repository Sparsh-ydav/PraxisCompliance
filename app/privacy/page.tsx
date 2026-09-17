"use client";

import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import Footer from "@/app/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-card/90 dark:bg-slate-900/90 border-b border-card-border dark:border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-municipal-blue dark:text-blue-400 tracking-tight"
          >
            <span className="w-4 h-4 bg-accent rounded-sm inline-block" />
            <span>PraxisCompliance</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-card-border hover:bg-card transition-colors text-muted hover:text-foreground"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-14">
        {/* Title & Metadata */}
        <div className="mb-10 pb-8 border-b border-card-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-4 font-mono">
            <span>🛡️</span>
            <span>Municipal Data Governance &amp; Privacy Protocol</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-municipal-blue dark:text-slate-100 tracking-tight mb-3">
            Privacy Policy &amp; Data Protection Standard
          </h1>
          <p className="text-sm text-muted dark:text-slate-400 font-mono">
            Effective Date: January 1, 2026 &bull; Protocol Version: v2.4.1 &bull; Certified GovCloud Standard
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-text dark:text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">01.</span>
              <span>Statutory Framework &amp; Scope</span>
            </h2>
            <p>
              PraxisCompliance Systems Inc. (&ldquo;PraxisCompliance,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
              &ldquo;the Platform&rdquo;) operates specialized pre-submission compliance audit software for municipal
              building permit applicants, registered design professionals (architects and licensed engineers), and
              municipal plans examiners.
            </p>
            <p>
              This Privacy Policy establishes our protocols for handling architectural drawings, building schematics,
              spatial coordinate data, and personally identifiable information (PII) processed across our applicant
              checking engine and reviewer decision-support dashboards.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">02.</span>
              <span>Architectural Blueprint &amp; CAD Data Governance</span>
            </h2>
            <p>
              When an applicant or municipality uploads an architectural blueprint (including PDF vector sheets, DWG/DXF
              geometries, or raster scans):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground dark:text-slate-100">Transient Spatial Analysis:</strong> Geometries
                are parsed into isolated spatial coordinate graphs strictly for determining compliance with applicable
                building codes (e.g., NBC 2016 Part 4 egress clearance, NBC Part 3 setback limits).
              </li>
              <li>
                <strong className="text-foreground dark:text-slate-100">Zero AI Training on Proprietary Drawings:</strong>{" "}
                We maintain a strict zero-retention model training policy. Architectural blueprints, structural framing
                schedules, and custom floor plans are never utilized to train, fine-tune, or calibrate public or shared
                machine learning foundation models.
              </li>
              <li>
                <strong className="text-foreground dark:text-slate-100">Customer Retained Intellectual Property:</strong>{" "}
                Submitting architects and applicants retain full, unencumbered copyright in their design documents.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">03.</span>
              <span>Personally Identifiable Information (PII) &amp; Parcel Redaction</span>
            </h2>
            <p>
              Title blocks on architectural sheets frequently display property owner names, licensed architect stamps,
              parcel identification numbers (PIN/APN), and residential addresses. Our ingestion pipeline automatically
              applies:
            </p>
            <div className="bg-card border border-card-border p-4 rounded-xl space-y-2">
              <p className="font-semibold text-foreground dark:text-slate-100">Automated Redaction Protections:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-muted dark:text-slate-400">
                <li>Automated optical masking of owner telephone numbers, personal emails, and digital seal private identifiers.</li>
                <li>Session-scoped tokenization of property addresses for compliance checking sessions.</li>
                <li>Strict role-based access control preventing cross-applicant data leakage.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">04.</span>
              <span>Security Infrastructure &amp; CJIS Alignment</span>
            </h2>
            <p>
              PraxisCompliance employs defense-in-depth security standards tailored for municipal and government records:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Encryption in Transit:</strong> All data is transmitted over TLS 1.3 with HSTS and forward secrecy.</li>
              <li><strong>Encryption at Rest:</strong> All stored session artifacts and audit trails are encrypted with AES-256 keys managed via dedicated hardware security modules (HSMs).</li>
              <li><strong>FedRAMP / SOC 2 Alignment:</strong> Our hosting infrastructure operates within SOC 2 Type II and ISO 27001 certified cloud enclaves.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">05.</span>
              <span>Retention &amp; Purge Schedules</span>
            </h2>
            <p>
              Applicants utilizing the pre-check engine maintain self-serve control over session history. Temporary
              compliance checks are purged after 30 days unless saved to an active project portfolio. Municipal reviewer
              records are governed by statutory municipal public records retention schedules (e.g., local administrative
              records acts).
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">06.</span>
              <span>Reviewer Audit Trail &amp; Human Governance Trace</span>
            </h2>
            <p>
              In compliance with administrative law standards, any preliminary correction letter or notice drafted by
              our pipeline contains an immutable cryptographic trace recording:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-xs">
              <li>The specific rule citation (e.g., NBC 2016 Part 4, Clause 4.10).</li>
              <li>The parsed blueprint element bounding coordinates.</li>
              <li>The municipal reviewer&apos;s digital signature and timestamp of human sign-off.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">07.</span>
              <span>Data Protection Officer &amp; Inquiries</span>
            </h2>
            <p>
              For questions regarding municipal data governance, GDPR/CCPA data subject requests, or to execute a
              Municipal Data Processing Addendum (DPA), please contact:
            </p>
            <div className="bg-card border border-card-border p-4 rounded-xl font-mono text-xs text-muted dark:text-slate-400 space-y-1">
              <p className="font-bold text-foreground dark:text-slate-200">PraxisCompliance Data Governance Office</p>
              <p>Email: privacy@praxiscompliance.internal</p>
              <p>Regulatory Compliance Division &bull; Suite 1400, Municipal Center Way</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
