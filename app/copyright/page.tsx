"use client";

import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import Footer from "@/app/components/Footer";

export default function CopyrightPage() {
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
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-card-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-4 font-mono">
            <span>⚖️</span>
            <span>Intellectual Property &amp; Statutory Legal Notices</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-municipal-blue dark:text-slate-100 tracking-tight mb-3">
            Copyright &amp; Regulatory Attribution
          </h1>
          <p className="text-sm text-muted dark:text-slate-400 font-mono">
            Last Updated: January 2026 &bull; PraxisCompliance Systems Inc. &bull; All Rights Reserved
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-text dark:text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">01.</span>
              <span>Platform Copyright &amp; Proprietary Algorithms</span>
            </h2>
            <p>
              &copy; 2026 PraxisCompliance Systems Inc. All rights reserved.
            </p>
            <p>
              The PraxisCompliance application, including its user interface design, visual component architecture,
              the <strong className="text-foreground dark:text-slate-100">Ripple Effect Simulation Engine</strong>,
              the <strong className="text-foreground dark:text-slate-100">Jurisdiction Memory Pattern Matcher</strong>,
              the <strong className="text-foreground dark:text-slate-100">Approval Readiness Scoring Algorithm</strong>,
              and all proprietary source code, documentation, and graphical assets are the exclusive intellectual
              property of PraxisCompliance Systems Inc.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">02.</span>
              <span>Ownership of Submitted Architectural Blueprints</span>
            </h2>
            <p>
              PraxisCompliance asserts no ownership or copyright claims over CAD files, building schematics, floor plans,
              or engineering calculations submitted by users.
            </p>
            <div className="p-4 rounded-xl bg-card border border-card-border space-y-2">
              <p className="font-semibold text-foreground dark:text-slate-100">Applicant Intellectual Property Guarantee:</p>
              <p className="text-xs text-muted dark:text-slate-400">
                Registered architects, structural engineers, and property applicants retain 100% ownership of their
                work. Uploading a blueprint to PraxisCompliance grants only a temporary, revocable license strictly
                for executing the automated compliance verification request.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">03.</span>
              <span>Statutory Building Codes &amp; Public Law Edicts</span>
            </h2>
            <p>
              PraxisCompliance indexes and cites statutory municipal building bylaws and national model standards.
              In accordance with legal doctrines regarding edicts of government:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-xs text-muted dark:text-slate-400">
              <li>
                <strong className="text-foreground dark:text-slate-200">National Building Code of India (NBC 2016):</strong>{" "}
                Clauses from NBC 2016 (Part 3, Part 4, Part 8) and Bureau of Indian Standards (BIS) referenced in
                compliance checks are statutory enactments cited for public compliance guidance under fair use.
              </li>
              <li>
                <strong className="text-foreground dark:text-slate-200">International Code Council (ICC):</strong> References
                to IBC 2024 and IRC 2024 are verbatim citations for legal cross-referencing and statutory plan compliance.
              </li>
              <li>
                <strong className="text-foreground dark:text-slate-200">Local Municipal Ordinances:</strong> Municipal
                development control regulations (DCR) and zoning bylaws are laws of the respective jurisdictions and
                remain in the public domain.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">04.</span>
              <span>Trademark Notice</span>
            </h2>
            <p>
              &ldquo;PraxisCompliance,&rdquo; &ldquo;Approval Readiness Score,&rdquo; &ldquo;The Ripple Effect Engine,&rdquo;
              and the PraxisCompliance logo mark are trademarks of PraxisCompliance Systems Inc. Other entity names,
              municipal seals, or third-party certifications appearing on the platform are the property of their
              respective owners and are used strictly for identification and comparative reference.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-municipal-blue dark:text-blue-300 flex items-center gap-2">
              <span className="text-base font-mono text-accent">05.</span>
              <span>DMCA &amp; Intellectual Property Inquiries</span>
            </h2>
            <p>
              If you believe that any content hosted or processed on the Platform infringes upon your copyright, please
              submit a formal notice containing the claimed work, proof of ownership, and specific locator URL to our
              Designated Copyright Agent:
            </p>
            <div className="bg-card border border-card-border p-4 rounded-xl font-mono text-xs text-muted dark:text-slate-400 space-y-1">
              <p className="font-bold text-foreground dark:text-slate-200">PraxisCompliance Legal Affairs &bull; IP Division</p>
              <p>Email: legal@praxiscompliance.internal</p>
              <p>Attn: Designated DMCA / Copyright Officer</p>
              <p>100 Civic Center Plaza, Suite 800</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
