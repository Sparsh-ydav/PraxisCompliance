"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-card/80 dark:bg-slate-900/90 text-slate-text dark:text-slate-300 transition-colors duration-200 mt-20">
      {/* Top Grid Section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 bg-accent rounded-sm inline-block shadow-xs" />
              <span className="text-xl font-extrabold text-municipal-blue dark:text-blue-400 tracking-tight">
                PraxisCompliance
              </span>
            </div>
            <p className="text-sm text-muted dark:text-slate-400 leading-relaxed max-w-sm">
              Municipal building permit compliance &amp; pre-submission readiness platform.
              Informed by historical correction letters and jurisdiction-specific review patterns
              to eliminate preventable revision cycles.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>GovCloud Operational</span>
              </div>
              <span className="text-xs font-mono text-muted dark:text-slate-500">v2.4.1</span>
            </div>
          </div>

          {/* Col 3: Platform Tools */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-municipal-blue dark:text-blue-300 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/app?tab=applicant"
                  className="text-muted dark:text-slate-400 hover:text-signature-ink dark:hover:text-blue-400 transition-colors"
                >
                  Applicant Pre-Check
                </Link>
              </li>
              <li>
                <Link
                  href="/app?tab=reviewer"
                  className="text-muted dark:text-slate-400 hover:text-signature-ink dark:hover:text-blue-400 transition-colors"
                >
                  Reviewer Queue
                </Link>
              </li>
              <li>
                <Link
                  href="/app"
                  className="text-muted dark:text-slate-400 hover:text-signature-ink dark:hover:text-blue-400 transition-colors"
                >
                  Ripple Effect Simulator
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted dark:text-slate-400 hover:text-signature-ink dark:hover:text-blue-400 transition-colors"
                >
                  Municipal Sign-In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Building Codes */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-municipal-blue dark:text-blue-300 mb-4">
              Regulatory Codes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-muted dark:text-slate-400">
                <span className="font-medium text-foreground dark:text-slate-200">NBC 2016</span> Part 4 &amp; 8
              </li>
              <li className="text-muted dark:text-slate-400">
                <span className="font-medium text-foreground dark:text-slate-200">ICC IBC 2024</span> Core Model
              </li>
              <li className="text-muted dark:text-slate-400">
                <span className="font-medium text-foreground dark:text-slate-200">IRC 2024</span> Residential Egress
              </li>
              <li className="text-muted dark:text-slate-400">
                <span className="font-medium text-foreground dark:text-slate-200">ADA Title III</span> Access Paths
              </li>
              <li className="text-muted dark:text-slate-400">
                <span className="font-medium text-foreground dark:text-slate-200">Local Zoning</span> Bylaw Matrix
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Legal */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-municipal-blue dark:text-blue-300 mb-4">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted dark:text-slate-400 hover:text-signature-ink dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/copyright"
                  className="text-muted dark:text-slate-400 hover:text-signature-ink dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Copyright &amp; IP Notice
                </Link>
              </li>
              <li className="text-muted dark:text-slate-400 text-xs leading-relaxed pt-1">
                Zero training on private CAD files without explicit applicant opt-in.
              </li>
            </ul>
          </div>
        </div>

        {/* Statutory Governance Safeguard Box */}
        <div className="mt-12 p-4 rounded-xl border border-card-border bg-card/60 dark:bg-slate-950/60 text-xs text-muted dark:text-slate-400 leading-relaxed">
          <span className="font-bold text-foreground dark:text-slate-200">Statutory Governance Notice:</span>{" "}
          PraxisCompliance operates strictly as an architectural pre-submission auditor and decision-support tool.
          The platform calculates an Approval Readiness Score and flags potential municipal code non-conformances based
          on historical review patterns. The platform does not issue statutory building permits, grant zoning variances,
          or approve applications. All final permit determinations, approvals, and variances are reserved exclusively
          to authorized human municipal plans examiners and building officials.
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted dark:text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} PraxisCompliance Systems Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/copyright" className="hover:underline">
              Copyright &amp; Licensing
            </Link>
            <span className="text-[11px] font-mono">SOC 2 Type II Certified Pipeline</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
