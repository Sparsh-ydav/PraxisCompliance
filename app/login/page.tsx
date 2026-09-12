"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="min-h-screen bg-paper-white flex flex-col">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold text-municipal-blue">
          PraxisCompliance
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-municipal-blue mb-8 text-center">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                I am a
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole("applicant")}
                  className={`flex-1 p-3 border-2 rounded text-sm font-medium transition-colors ${
                    role === "applicant"
                      ? "border-signature-ink bg-accent-light text-signature-ink"
                      : "border-slate-300 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  Applicant
                </button>
                <button
                  type="button"
                  onClick={() => setRole("reviewer")}
                  className={`flex-1 p-3 border-2 rounded text-sm font-medium transition-colors ${
                    role === "reviewer"
                      ? "border-signature-ink bg-accent-light text-signature-ink"
                      : "border-slate-300 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  Reviewer
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@municipality.gov"
                className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-signature-ink"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-signature-ink"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!role}
              className="w-full bg-signature-ink text-white p-3 rounded font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Sign In
            </button>

            <p className="text-xs text-slate-500 mt-4 text-center">
              Forgot password? Contact your administrator
            </p>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={handleDemoMode}
              className="text-sm text-signature-ink hover:underline font-medium"
            >
              Try Demo Mode without signing in
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 text-center text-xs text-slate-500">
        <p>PraxisCompliance — Hackathon MVP for Smart Governance &amp; Compliance</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper-white flex items-center justify-center text-slate-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
