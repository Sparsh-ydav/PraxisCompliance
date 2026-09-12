"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

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
    <div className="min-h-screen bg-paper-white text-slate-text">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-municipal-blue">PraxisCompliance</span>
          <div className="flex gap-6 items-center">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem("crossbeam-auth");
                  localStorage.removeItem("crossbeam-role");
                  localStorage.removeItem("crossbeam-email");
                  setIsLoggedIn(false);
                }}
                className="text-sm font-medium hover:text-signature-ink"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-signature-ink">
                Sign In
              </Link>
            )}
            <Link
              href="/app"
              className="text-sm font-medium bg-signature-ink text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 py-24 overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left — text content */}
          <div>
            <h1 className="text-5xl font-bold text-municipal-blue leading-tight mb-8 max-w-2xl">
              Stop writing the same correction letter twice.
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-xl leading-relaxed">
              PraxisCompliance learns from your municipality&apos;s historical correction letters to catch
              common issues before applicants submit. Fewer revisions, faster approvals.
            </p>

            {/* CTA buttons */}
            <div className="flex gap-4 mb-16">
              <button
                onClick={() => handleProtectedNav("/app?tab=applicant")}
                className="bg-signature-ink text-white px-6 py-3 rounded font-medium hover:bg-blue-700 cursor-pointer"
              >
                Check a Blueprint
              </button>
              <button
                onClick={() => handleProtectedNav("/app?tab=reviewer")}
                className="border border-municipal-blue text-municipal-blue px-6 py-3 rounded font-medium hover:bg-slate-50 cursor-pointer"
              >
                Reviewer Dashboard
              </button>
            </div>
          </div>

          {/* Right — 3D Orb floating seamlessly beside heading */}
          <div className="relative w-full h-[460px] md:h-[520px] flex items-center justify-center">
            {/* Subtle soft ambient glow radiating outward behind the orb */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.12) 0%, rgba(6, 182, 212, 0.06) 45%, transparent 70%)",
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
          <div className="border-2 border-slate-300 rounded p-6 bg-white">
            <p className="text-xs font-semibold text-slate-500 mb-3">Without PraxisCompliance</p>
            <div className="space-y-2 text-sm text-slate-600">
              <p>1. Applicant submits plans</p>
              <p>2. Reviewer finds egress violation</p>
              <p>3. Writes correction letter (30 min)</p>
              <p>4. Applicant revises</p>
              <p>5. Resubmits (14 days later)</p>
              <p className="text-blocking font-semibold pt-2">
                Total: 2–3 weeks per revision cycle
              </p>
            </div>
          </div>

          <div className="border-2 border-success rounded p-6 bg-white">
            <p className="text-xs font-semibold text-success mb-3">With PraxisCompliance</p>
            <div className="space-y-2 text-sm text-slate-600">
              <p>1. Applicant uploads plans</p>
              <p>2. PraxisCompliance flags egress violation instantly</p>
              <p>3. Applicant fixes before submitting</p>
              <p>4. Reviewer approves clean application</p>
              <p className="text-success font-semibold pt-2">
                Total: Submit once, approve faster
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Audience */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-municipal-blue mb-4">For Applicants</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Upload your blueprint and get instant feedback on egress, setback, and code
              compliance. See exactly what reviewers will flag, with citations and confidence
              scores. Fix issues before you file.
            </p>
            <ul className="space-y-3 text-sm text-slate-600 mb-6">
              <li className="flex gap-2">
                <span className="text-success font-bold">✓</span>
                Pre-submission compliance check
              </li>
              <li className="flex gap-2">
                <span className="text-success font-bold">✓</span>
                Prioritized action plan
              </li>
              <li className="flex gap-2">
                <span className="text-success font-bold">✓</span>
                Learn from past corrections
              </li>
            </ul>
            <button
              onClick={() => handleProtectedNav("/app?tab=applicant")}
              className="inline-block bg-signature-ink text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 cursor-pointer"
            >
              Check a Blueprint
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-municipal-blue mb-4">For Reviewers</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Batch queue sorted by severity. AI-drafted correction letters ready for your
              approval. Spend your time on judgment calls, not writing boilerplate.
            </p>
            <ul className="space-y-3 text-sm text-slate-600 mb-6">
              <li className="flex gap-2">
                <span className="text-success font-bold">✓</span>
                Severity-sorted application queue
              </li>
              <li className="flex gap-2">
                <span className="text-success font-bold">✓</span>
                Draft correction letters
              </li>
              <li className="flex gap-2">
                <span className="text-success font-bold">✓</span>
                Edit before sending
              </li>
            </ul>
            <button
              onClick={() => handleProtectedNav("/app?tab=reviewer")}
              className="inline-block border border-municipal-blue text-municipal-blue px-5 py-2 rounded text-sm font-medium hover:bg-slate-50 cursor-pointer"
            >
              Open Reviewer Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-municipal-blue mb-12">How It Works</h2>
        <div className="space-y-8 max-w-2xl">
          <div>
            <h3 className="text-xl font-semibold text-municipal-blue mb-2">
              Learn from historical corrections
            </h3>
            <p className="text-slate-600 leading-relaxed">
              PraxisCompliance analyzes your municipality&apos;s past correction letters to identify
              patterns: which violations reviewers always flag, which get waived, and how
              strictly local practice enforces written code.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-municipal-blue mb-2">
              Check against code and practice
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Every blueprint is checked against written regulations and learned reviewer
              patterns. Findings show their source (code or pattern) and confidence level,
              so applicants know what&apos;s blocking versus advisory.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-municipal-blue mb-2">
              Human reviewer always approves
            </h3>
            <p className="text-slate-600 leading-relaxed">
              AI drafts, humans decide. Reviewers see pre-written correction letters they
              can approve as-is, edit, or reject. No application is approved by AI alone.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-slate-500">
          <p>PraxisCompliance — Built for the Smart Governance &amp; Compliance track. Hackathon MVP.</p>
        </div>
      </footer>
    </div>
  );
}
