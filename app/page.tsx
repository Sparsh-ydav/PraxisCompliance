"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import Footer from "@/app/components/Footer";

const HeroOrb = dynamic(() => import("@/app/components/HeroOrb"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500/20 to-amber-500/10 animate-pulse" />
    </div>
  ),
});

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("crossbeam-auth") === "true");
  }, []);

  const handleProtectedNav = (path: string) => {
    if (isLoggedIn) {
      router.push(path);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col selection:bg-accent/20">
      {/* Navigation */}
      <nav className="border-b border-card-border bg-card/90 dark:bg-slate-900/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-5 h-5 bg-accent rounded-sm inline-block shadow-xs" />
            <span className="text-xl font-extrabold text-municipal-blue dark:text-blue-400 tracking-tight">
              PraxisCompliance
            </span>
          </Link>
          <div className="flex gap-4 items-center">
            <ThemeToggle />

            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem("crossbeam-auth");
                  localStorage.removeItem("crossbeam-role");
                  localStorage.removeItem("crossbeam-email");
                  setIsLoggedIn(false);
                }}
                className="text-sm font-medium text-muted hover:text-signature-ink dark:hover:text-blue-400 cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-muted hover:text-signature-ink dark:hover:text-blue-400 transition-colors"
              >
                Sign In
              </Link>
            )}
            <Link
              href="/app"
              className="text-sm font-semibold bg-signature-ink hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-xs transition-colors"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 md:py-20 overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left — text content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-beige-100 dark:bg-blue-950/80 text-municipal-blue dark:text-blue-300 border border-card-border dark:border-blue-800 mb-6 font-mono">
              <span className="text-sm">🏛️</span>
              <span>Municipal Plan Review &amp; Pre-Submission Readiness</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-municipal-blue dark:text-slate-100 leading-[1.15] mb-6 max-w-2xl tracking-tight">
              Stop writing the same correction letter twice.
            </h1>
            <p className="text-base md:text-lg text-muted dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
              PraxisCompliance evaluates CAD blueprints against municipal zoning bylaws, NBC 2016 / IBC regulations,
              and historical reviewer correction letters. Resolve blocking egress and setback conflicts before formal plan filing.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => handleProtectedNav("/app?tab=applicant")}
                className="bg-signature-ink text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 cursor-pointer shadow-sm transition-all flex items-center gap-2"
              >
                <span>Check a Blueprint</span>
                <span>&rarr;</span>
              </button>
              <button
                onClick={() => handleProtectedNav("/app?tab=reviewer")}
                className="border border-card-border dark:border-slate-700 text-foreground dark:text-slate-200 bg-card dark:bg-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-beige-100 dark:hover:bg-slate-800 cursor-pointer transition-colors shadow-xs"
              >
                Reviewer Dashboard
              </button>
            </div>

            {/* Standards Ticker */}
            <div className="pt-2 text-xs font-mono text-muted dark:text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-semibold text-foreground dark:text-slate-300">Codified Standards:</span>
              <span>NBC 2016 Part 4 &amp; 8</span>
              <span>&bull;</span>
              <span>ICC IBC 2024</span>
              <span>&bull;</span>
              <span>IRC Residential</span>
              <span>&bull;</span>
              <span>ADA Title III</span>
            </div>
          </div>

          {/* Right — 3D Orb canvas */}
          <div className="relative w-full h-[440px] md:h-[500px] flex items-center justify-center">
            <div
              className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-60 dark:opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.12) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 70%)",
              }}
            />
            <div className="relative w-full h-full">
              <HeroOrb />
            </div>
          </div>
        </div>

        {/* Enterprise Impact Metrics Bar */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 mb-16">
          <div className="p-5 rounded-xl border border-card-border bg-card dark:bg-slate-900 shadow-xs">
            <div className="text-3xl font-black font-mono text-signature-ink dark:text-blue-400">71.4%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted dark:text-slate-400 mt-1">
              Fewer Correction Cycles
            </div>
            <div className="text-[11px] text-muted/80 dark:text-slate-500 mt-1 leading-normal">
              First-round plan deficiency letters averted in pilot municipalities
            </div>
          </div>

          <div className="p-5 rounded-xl border border-card-border bg-card dark:bg-slate-900 shadow-xs">
            <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">18.2 Days</div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted dark:text-slate-400 mt-1">
              Turnaround Saved
            </div>
            <div className="text-[11px] text-muted/80 dark:text-slate-500 mt-1 leading-normal">
              Average reduction from submission intake to reviewer approval
            </div>
          </div>

          <div className="p-5 rounded-xl border border-card-border bg-card dark:bg-slate-900 shadow-xs">
            <div className="text-3xl font-black font-mono text-foreground dark:text-slate-100">94.6%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted dark:text-slate-400 mt-1">
              Detection Precision
            </div>
            <div className="text-[11px] text-muted/80 dark:text-slate-500 mt-1 leading-normal">
              Validated against 1,420+ historical municipal correction letters
            </div>
          </div>

          <div className="p-5 rounded-xl border border-card-border bg-card dark:bg-slate-900 shadow-xs">
            <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">19,800+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted dark:text-slate-400 mt-1">
              Codified Clauses
            </div>
            <div className="text-[11px] text-muted/80 dark:text-slate-500 mt-1 leading-normal">
              Indexed across NBC 2016, IBC, IRC &amp; local zoning bylaws
            </div>
          </div>
        </div>

        {/* Before / After Comparison */}
        <div className="relative z-10 grid md:grid-cols-2 gap-6 mb-16">
          <div className="border border-card-border dark:border-slate-800 rounded-xl p-6 bg-card dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono uppercase tracking-wider">
                Conventional Municipal Intake
              </span>
              <span className="text-xs font-mono text-muted dark:text-slate-500">2–3 Weeks Delay</span>
            </div>
            <div className="space-y-2.5 text-xs text-muted dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="font-mono text-slate-400">01</span>
                <span>Applicant files unverified blueprint via online portal or counter</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-slate-400">02</span>
                <span>Plan examiner manually measures egress window net clear opening (14 days queue wait)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-slate-400">03</span>
                <span>Reviewer writes 4-page formal Correction Notice for 16&quot; width non-conformance</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-slate-400">04</span>
                <span>Applicant redesigns, shifts window east, and re-submits</span>
              </div>
              <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400 font-semibold pt-1">
                <span>&times;</span>
                <span>New revision inadvertently infringes 6 ft side-yard setback — triggering revision cycle #2</span>
              </div>
            </div>
          </div>

          <div className="border border-emerald-500/50 dark:border-emerald-600/60 rounded-xl p-6 bg-card dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider">
                PraxisCompliance Pre-Audit
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Immediate Readiness</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-text dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="font-mono text-emerald-600 font-bold">01</span>
                <span>Applicant uploads blueprint prior to formal submission</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-emerald-600 font-bold">02</span>
                <span>Engine flags NBC Clause 4.10 violation on Window W2 (16&quot; vs 20&quot; required)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-emerald-600 font-bold">03</span>
                <span><strong>The Ripple Effect Simulator</strong> warns: widening W2 eastward infringes Setback S3</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-emerald-600 font-bold">04</span>
                <span>Applicant selects compliant 22&quot; casement fix, achieving 100/100 Readiness Score</span>
              </div>
              <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                <span>&check;</span>
                <span>Plan examiner verifies clean submission and signs off without correction letters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audited Precedent Case Studies */}
      <section className="bg-card/60 dark:bg-slate-900/50 border-y border-card-border py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-bold font-mono text-signature-ink dark:text-blue-400 uppercase tracking-wider mb-2">
                Municipal Case Precedents
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-municipal-blue dark:text-slate-100 tracking-tight">
                Authentic Pre-Submission Audits
              </h2>
            </div>
            <p className="text-xs text-muted dark:text-slate-400 max-w-md">
              Real municipal inspection data evaluated against NBC 2016 building bylaws and historical correction letters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case 1 */}
            <div className="bg-card dark:bg-slate-900 p-6 rounded-xl border border-card-border shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                    BPR-2025-0388
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-600">Score: 40/100</span>
                </div>
                <h3 className="text-base font-bold text-foreground dark:text-slate-100 mb-1">
                  Basement Bedroom Conversion
                </h3>
                <p className="text-xs text-muted mb-4">45 Birchwood Lane &bull; Single Family Dwelling</p>
                <div className="space-y-2 text-xs border-t border-card-border pt-3">
                  <p className="text-rose-600 dark:text-rose-400 font-semibold">
                    &bull; Blocking: NBC Part 4 Cl 4.10 (Window W2 opening 16&quot; &lt; 20&quot; min)
                  </p>
                  <p className="text-rose-600 dark:text-rose-400 font-semibold">
                    &bull; Blocking: NBC Part 4 Table 7 (Missing interconnected smoke alarm)
                  </p>
                  <p className="text-muted dark:text-slate-400">
                    &bull; Reviewer Pattern: Egress width strictly enforced without tolerance.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-card-border text-[11px] font-mono text-muted flex justify-between">
                <span>Action: Remediation required</span>
                <span className="text-signature-ink font-semibold">Demo Blueprint A</span>
              </div>
            </div>

            {/* Case 2 */}
            <div className="bg-card dark:bg-slate-900 p-6 rounded-xl border border-card-border shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                    BPR-2025-0402
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-600">Score: 75/100</span>
                </div>
                <h3 className="text-base font-bold text-foreground dark:text-slate-100 mb-1">
                  Side-Yard Kitchen Addition
                </h3>
                <p className="text-xs text-muted mb-4">88 Maple Street &bull; R-2 Residential District</p>
                <div className="space-y-2 text-xs border-t border-card-border pt-3">
                  <p className="text-amber-600 dark:text-amber-400 font-semibold">
                    &bull; Advisory: NBC Part 3 Cl 8.2.3 (Side setback 1.68 m vs 1.8 m req)
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    &bull; Administrative Waiver Eligible under NBC Part 2 Cl 12.5 (&lt; 150 mm)
                  </p>
                  <p className="text-muted dark:text-slate-400">
                    &bull; Historical Pattern: 92% approval rate with surveyor demarcation.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-card-border text-[11px] font-mono text-muted flex justify-between">
                <span>Action: Attach surveyor plan</span>
                <span className="text-signature-ink font-semibold">Demo Blueprint B</span>
              </div>
            </div>

            {/* Case 3 */}
            <div className="bg-card dark:bg-slate-900 p-6 rounded-xl border border-card-border shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                    BPR-2025-0407
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">Score: 100/100</span>
                </div>
                <h3 className="text-base font-bold text-foreground dark:text-slate-100 mb-1">
                  Rear Master Suite Addition
                </h3>
                <p className="text-xs text-muted mb-4">302 Cedar Court &bull; Low-Density Residential</p>
                <div className="space-y-2 text-xs border-t border-card-border pt-3">
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    &bull; Egress: 24&quot; &times; 36&quot; casement verified (Exceeds 500 mm)
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    &bull; Setbacks: 8.2 m rear open space satisfies 7.5 m requirement
                  </p>
                  <p className="text-muted dark:text-slate-400">
                    &bull; Reviewer Pattern: Zero historical correction items on file.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-card-border text-[11px] font-mono text-muted flex justify-between">
                <span>Action: Fast-track sign-off</span>
                <span className="text-signature-ink font-semibold">Demo Blueprint C</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Audience Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block text-xs font-bold font-mono text-signature-ink dark:text-blue-400 uppercase tracking-wider mb-2">
              For Architects &amp; Permit Expeditors
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-municipal-blue dark:text-slate-100 mb-4">
              Pre-submission readiness, zero guesswork.
            </h2>
            <p className="text-sm text-muted dark:text-slate-400 mb-6 leading-relaxed">
              Upload your architectural drawings in vector PDF or raster format. PraxisCompliance parses room
              dimensions, window clearances, and boundary offsets against codified regulations and learned municipal review habits.
            </p>
            <ul className="space-y-3 text-xs text-foreground dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">&check;</span>
                <span>Approval Readiness Score (100-point transparent formula)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">&check;</span>
                <span>Exact building code section citations (e.g., NBC 2016 Part 4 Cl 4.10)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">&check;</span>
                <span>Multi-factor Ripple Effect simulation to prevent cascading side-setback violations</span>
              </li>
            </ul>
            <button
              onClick={() => handleProtectedNav("/app?tab=applicant")}
              className="bg-signature-ink text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              Test an Applicant Submission
            </button>
          </div>

          <div>
            <div className="inline-block text-xs font-bold font-mono text-signature-ink dark:text-blue-400 uppercase tracking-wider mb-2">
              For Municipal Plans Examiners
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-municipal-blue dark:text-slate-100 mb-4">
              Severity-sorted queues &amp; AI drafting co-pilot.
            </h2>
            <p className="text-sm text-muted dark:text-slate-400 mb-6 leading-relaxed">
              Reviewer backlogs drop dramatically when submissions arrive pre-screened. When issues persist,
              PraxisDraft synthesizes preliminary correction letters complete with regulatory citations ready for examiner editing and sign-off.
            </p>
            <ul className="space-y-3 text-xs text-foreground dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">&check;</span>
                <span>Severity-prioritized pending queue (blocking vs advisory items)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">&check;</span>
                <span>Reviewer sign-off controls: approve as-is, edit draft, or reject with notes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">&check;</span>
                <span>Immutable cryptographic session audit trail for legal compliance</span>
              </li>
            </ul>
            <button
              onClick={() => handleProtectedNav("/app?tab=reviewer")}
              className="border border-card-border text-foreground dark:text-slate-200 bg-card dark:bg-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-beige-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              Access Reviewer Console
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section className="bg-card/40 dark:bg-slate-900/40 border-t border-card-border py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-municipal-blue dark:text-slate-100 tracking-tight mb-3">
              Four Core Capabilities
            </h2>
            <p className="text-xs text-muted dark:text-slate-400">
              Engineered specifically for the nuances of architectural blueprints and municipal review bureaucracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-card-border bg-card dark:bg-slate-900 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-signature-ink flex items-center justify-center font-mono font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-foreground dark:text-slate-100 mb-2">
                Blueprint Evidence &amp; Spatial Parsing
              </h3>
              <p className="text-xs text-muted dark:text-slate-400 leading-relaxed">
                Every finding links directly to extracted blueprint elements. The system computes net clear openings
                (deducting sash frames and masonry rebates) and verifies sill heights against finished floor levels.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-card-border bg-card dark:bg-slate-900 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center font-mono font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-foreground dark:text-slate-100 mb-2">
                The Ripple Effect Simulator
              </h3>
              <p className="text-xs text-muted dark:text-slate-400 leading-relaxed">
                Fixing one code non-conformance frequently violates an adjacent requirement. Our modular simulation
                graph traces how dimension modifications propagate across setback, structural, and egress dependencies.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-card-border bg-card dark:bg-slate-900 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 flex items-center justify-center font-mono font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-foreground dark:text-slate-100 mb-2">
                Jurisdiction Memory Intelligence
              </h3>
              <p className="text-xs text-muted dark:text-slate-400 leading-relaxed">
                Building bylaws are interpreted differently across municipal borders. PraxisCompliance extracts learned
                enforcement behaviors from historical correction letters—differentiating strict thresholds from standard administrative waivers.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-card-border bg-card dark:bg-slate-900 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-mono font-bold text-lg mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-foreground dark:text-slate-100 mb-2">
                Statutory Reviewer Decision Support
              </h3>
              <p className="text-xs text-muted dark:text-slate-400 leading-relaxed">
                Municipal reviewers retain final statutory determination. The platform auto-generates preliminary notices
                that examiners can sign off as-is, edit, or reject, accompanied by a complete cryptographic audit log.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
