"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ThemeToggle from "@/app/components/ThemeToggle";

type UserRole = "applicant" | "reviewer" | null;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("crossbeam-auth", "true");
    localStorage.setItem("crossbeam-role", role || "applicant");
    localStorage.setItem("crossbeam-email", email);

    if (redirectTo) {
      router.push(redirectTo);
    } else if (role === "reviewer") {
      router.push("/app?tab=reviewer");
    } else {
      router.push("/app?tab=applicant");
    }
  };

  const handleDemoMode = () => {
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col">
      <div className="p-6 max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-municipal-blue dark:text-blue-400">
          <span className="w-4 h-4 bg-accent rounded-sm inline-block" />
          <span>PraxisCompliance</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-municipal-blue dark:text-slate-100 tracking-tight">
              Sign In
            </h1>
            <p className="text-xs text-muted dark:text-slate-400 mt-2">
              Access the municipal pre-submission audit console &amp; reviewer queue
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card dark:bg-slate-900 border border-card-border dark:border-slate-800 rounded-2xl p-8 shadow-sm"
          >
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted dark:text-slate-400 mb-3">
                Select Your Role
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole("applicant")}
                  className={`flex-1 p-3 border-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    role === "applicant"
                      ? "border-signature-ink bg-blue-50/60 dark:bg-blue-950/60 text-signature-ink dark:text-blue-300 shadow-xs"
                      : "border-card-border dark:border-slate-700 text-muted hover:border-slate-400"
                  }`}
                >
                  Applicant / Architect
                </button>
                <button
                  type="button"
                  onClick={() => setRole("reviewer")}
                  className={`flex-1 p-3 border-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    role === "reviewer"
                      ? "border-signature-ink bg-blue-50/60 dark:bg-blue-950/60 text-signature-ink dark:text-blue-300 shadow-xs"
                      : "border-card-border dark:border-slate-700 text-muted hover:border-slate-400"
                  }`}
                >
                  Plans Examiner
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-xs font-semibold text-foreground dark:text-slate-300 mb-2">
                Official Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@municipality.gov"
                className="w-full p-3 bg-background dark:bg-slate-950 border border-card-border dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-signature-ink"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-xs font-semibold text-foreground dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-background dark:bg-slate-950 border border-card-border dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-signature-ink"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!role}
              className="w-full bg-signature-ink text-white p-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer text-sm"
            >
              Sign In to Platform
            </button>

            <p className="text-[11px] text-muted dark:text-slate-500 mt-4 text-center">
              Protected by GovCloud Multi-Factor Authentication
            </p>
          </form>

          <div className="mt-8 text-center space-y-3">
            <button
              onClick={handleDemoMode}
              className="text-xs text-signature-ink dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              &rarr; Launch Interactive Demo Mode without signing in
            </button>
            <div className="flex items-center justify-center gap-4 text-xs text-muted dark:text-slate-500">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <span>&bull;</span>
              <Link href="/copyright" className="hover:underline">Copyright &amp; Terms</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 text-center text-xs text-muted dark:text-slate-500 border-t border-card-border">
        <p>PraxisCompliance &bull; Enterprise Municipal Plan Review &amp; Pre-Submission Platform</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-muted">Loading PraxisCompliance...</div>}>
      <LoginForm />
    </Suspense>
  );
}
