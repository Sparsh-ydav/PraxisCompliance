"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";

const HeroOrb = dynamic(() => import("@/app/components/HeroOrb"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse" />
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
    <div className="min-h-screen bg-paper-white dark:bg-slate-950 text-slate-text dark:text-slate-200 transition-colors duration-200">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-accent rounded-sm inline-block" />
            <span className="text-xl font-bold text-municipal-blue dark:text-blue-400 tracking-tight">
              PraxisCompliance
            </span>
          </div>
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
                className="text-sm font-medium hover:text-signature-ink dark:hover:text-blue-400 cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-signature-ink dark:hover:text-blue-400">
                Sign In
              </Link>
            )}
            <Link
              href="/app"
              className="text-sm font-medium bg-signature-ink hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-xs transition-colors"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 md:py-24 overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left — text content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-6 font-mono">
              <span>🏛️</span>
              <span>Next-Gen Municipal Plan Compliance</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-municipal-blue dark:text-slate-100 leading-tight mb-6 max-w-2xl tracking-tight">
              Stop writing the same correction letter twice.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
              PraxisCompliance is informed by historical correction letters and jurisdiction-specific review patterns to catch
              common issues before applicants submit. Fewer revisions, higher approval readiness.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-16">
              <button
                onClick={() => handleProtectedNav("/app?tab=applicant")}
                className="bg-signature-ink text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 cursor-pointer shadow-sm transition-colors"
              >
                Check a Blueprint
              </button>
              <button
                onClick={() => handleProtectedNav("/app?tab=reviewer")}
                className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Reviewer Dashboard
              </button>
            </div>
          </div>

          {/* Right — 3D Orb floating seamlessly beside heading */}
          <div className="relative w-full h-[460px] md:h-[520px] flex items-center justify-center">
            {/* Subtle soft ambient glow radiating outward behind the orb */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-70 dark:opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)",
              }}
            />
            {/* The 3D Orb canvas */}
            <div className="relative w-full h-full">
              <HeroOrb />
            </div>
          </div>
        </div>

        {/* Before/After Visual */}
        <div className="relative z-10 grid md:grid-cols-2 gap-8 mb-16">
          <div className="border-2 border-slate-300 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 font-mono uppercase tracking-wider">Without PraxisCompliance</p>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>1. Applicant submits plans</p>
              <p>2. Reviewer finds egress violation</p>
              <p>3. Writes correction letter (30 min)</p>
              <p>4. Applicant revises</p>
              <p>5. Resubmits (14 days later)</p>
              <p className="text-rose-600 dark:text-rose-400 font-semibold pt-2">
                Total: 2–3 weeks per revision cycle
              </p>
            </div>
          </div>

          <div className="border-2 border-emerald-500 dark:border-emerald-600 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3 font-mono uppercase tracking-wider">With PraxisCompliance</p>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>1. Applicant uploads plans</p>
              <p>2. PraxisCompliance flags egress violation instantly</p>
              <p>3. Applicant fixes before submitting</p>
              <p>4. Municipal reviewer verifies and signs off on compliant submission</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold pt-2">
                Total: Submit with high readiness, accelerate municipal review
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Audience */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-municipal-blue dark:text-blue-400 mb-4">For Applicants</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Upload your blueprint and get instant feedback on egress, setback, and code
              compliance. See exactly what reviewers will flag, with citations and confidence
              scores. Fix issues before you file.
            </p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-6">
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Pre-submission compliance check
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Prioritized action plan with multi-option fixes
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Learn from observed jurisdiction patterns
              </li>
            </ul>
            <button
              onClick={() => handleProtectedNav("/app?tab=applicant")}
              className="inline-block bg-signature-ink text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
            >
              Check a Blueprint
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-municipal-blue dark:text-blue-400 mb-4">For Reviewers</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Batch queue sorted by severity. AI-drafted notices ready for reviewer determination and
              sign-off. Spend your time on judgment calls, not writing boilerplate.
            </p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-6">
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Severity-sorted application queue
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Draft correction letters with human edit controls
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                Immutable session audit trail
              </li>
            </ul>
            <button
              onClick={() => handleProtectedNav("/app?tab=reviewer")}
              className="inline-block border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Open Reviewer Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-municipal-blue dark:text-slate-100 mb-12">How It Works</h2>
        <div className="space-y-8 max-w-2xl">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Informed by historical correction patterns
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              PraxisCompliance is informed by your municipality&apos;s historical review patterns to identify
              which violations reviewers always flag, which get waived, and how
              strictly local practice enforces written code.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Check against code and practice
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              Every blueprint is checked against written regulations and learned reviewer
              patterns. Findings show their source (code or pattern) and confidence level,
              so applicants know what&apos;s blocking versus advisory.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Human reviewers retain final determination
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              AI drafts, humans decide. Reviewers see pre-written correction notices they
              can sign off as-is, edit, or reject. The system provides readiness assessments —
              no permit application is approved by AI.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-slate-500 dark:text-slate-400">
          <p>PraxisCompliance — Built for Smart Governance &amp; Municipal Plan Compliance.</p>
        </div>
      </footer>
    </div>
  );
}
