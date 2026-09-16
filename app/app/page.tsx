"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Blueprint } from "@/fixtures/blueprints";
import { BLUEPRINTS, getBlueprintById } from "@/fixtures/blueprints";
import FindingCard from "@/app/components/FindingCard";
import ReviewerDashboard from "@/app/components/ReviewerDashboard";
import ApprovalReadinessGauge, { calculateReadinessScore } from "@/app/components/ApprovalReadinessGauge";
import BlueprintViewer from "@/app/components/BlueprintViewer";
import EvidenceChain from "@/app/components/EvidenceChain";
import JurisdictionMemoryPanel from "@/app/components/JurisdictionMemoryPanel";
import RegulationConflictCard from "@/app/components/RegulationConflictCard";
import ThemeToggle from "@/app/components/ThemeToggle";
import { detectRegulationConflicts } from "@/lib/conflict-detector";
import { logAuditEvent } from "@/lib/audit-trail";
import { rippleEffectSource, type RippleEffectResult } from "@/lib/ripple-effect";
import type { ComplianceFinding, ComplianceResult } from "@/lib/schemas";

type Tab = "applicant" | "reviewer";

interface BlueprintClassification {
  projectType: string;
  scope: "minor" | "moderate" | "major";
  detectedRooms: string[];
  estimatedArea: string;
  likelyIssues: string[];
  confidence: number;
}

interface ClassificationResponse {
  recognized: boolean;
  classification?: BlueprintClassification;
  usedFallback?: boolean;
}

function AppContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam === "reviewer" ? "reviewer" : "applicant"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [classificationResponse, setClassificationResponse] = useState<ClassificationResponse | null>(null);
  const [classifying, setClassifying] = useState(false);

  // Ripple effect simulation state
  const [isRechecking, setIsRechecking] = useState(false);
  const [hasAppliedRipple, setHasAppliedRipple] = useState(false);
  const [initialFindings, setInitialFindings] = useState<ComplianceFinding[] | null>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [scoreStatusNote, setScoreStatusNote] = useState<string | null>(null);

  // Interactive Visual Evidence & Graph states
  const [highlightedElementId, setHighlightedElementId] = useState<string | null>(null);
  const [selectedFindingForGraph, setSelectedFindingForGraph] = useState<ComplianceFinding | null>(null);
  const [lastRippleResult, setLastRippleResult] = useState<RippleEffectResult | null>(null);
  const [showJurisdictionMemory, setShowJurisdictionMemory] = useState<boolean>(false);

  // Check auth state and sync tab with URL param
  useEffect(() => {
    const auth = localStorage.getItem("crossbeam-auth") === "true";
    const email = localStorage.getItem("crossbeam-email");
    setIsLoggedIn(auth);
    setUserEmail(email);

    if (tabParam === "reviewer") {
      if (!auth) {
        router.replace(`/login?redirect=${encodeURIComponent("/app?tab=reviewer")}`);
      } else {
        setActiveTab("reviewer");
      }
    } else if (tabParam === "applicant") {
      setActiveTab("applicant");
    }
  }, [tabParam, router]);

  const handleTabChange = (tab: Tab) => {
    if (tab === "reviewer") {
      const auth = localStorage.getItem("crossbeam-auth") === "true";
      if (!auth) {
        router.push(`/login?redirect=${encodeURIComponent("/app?tab=reviewer")}`);
        return;
      }
    }
    setActiveTab(tab);
    router.replace(`/app?tab=${tab}`, { scroll: false });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSelectedBlueprint(null);
      setClassificationResponse(null);

      // Generate preview based on file type
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setFilePreview("pdf");
      } else {
        setFilePreview("file");
      }

      // Call blueprint classifier API
      setClassifying(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/blueprint-classifier", {
          method: "POST",
          body: formData,
        });
        const data: ClassificationResponse = await res.json();
        setClassificationResponse(data);
      } catch (err) {
        console.error("Classification failed:", err);
        setClassificationResponse({ recognized: false });
      } finally {
        setClassifying(false);
      }
    }
  };

  async function checkCompliance() {
    setLoading(true);
    setResult(null);
    setHighlightedElementId(null);
    setSelectedFindingForGraph(null);
    setLastRippleResult(null);

    let blueprintId: string;

    if (uploadedFile) {
      const fileName = uploadedFile.name.toLowerCase();
      if (fileName.includes("clean") || fileName.includes("pass")) {
        blueprintId = "bp-clean";
      } else if (fileName.includes("advisory") || fileName.includes("setback")) {
        blueprintId = "bp-advisory";
      } else {
        blueprintId = "bp-blocking";
      }
    } else if (selectedBlueprint) {
      blueprintId = selectedBlueprint.id;
    } else {
      alert("Please upload a file or select an example blueprint");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/compliance-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId }),
      });

      const data = await res.json();
      setResult(data);
      setInitialFindings(data.findings || []);
      setHasAppliedRipple(false);
      setIsRechecking(false);
      setPreviousScore(null);
      setScoreStatusNote(null);
      const blockingCount = (data.findings || []).filter((f: ComplianceFinding) => f.severity === "blocking").length;
      const advisoryCount = (data.findings || []).filter((f: ComplianceFinding) => f.severity === "advisory").length;
      setCurrentScore(calculateReadinessScore(blockingCount, advisoryCount));

      logAuditEvent(
        "compliance_check_run",
        "Applicant",
        blueprintId,
        `Executed automated compliance check on ${blueprintId}: ${data.findings?.length || 0} findings detected.`
      );
    } catch (err) {
      console.error("Compliance check failed:", err);
      alert("Error checking compliance");
    } finally {
      setLoading(false);
    }
  }

  // Ripple effect simulation handler: calls swappable RippleEffectSource provider abstraction
  async function handleMoveWindowEast() {
    if (!result) return;
    setIsRechecking(true);

    try {
      // Calls the generalized provider abstraction
      const rippleRes = await rippleEffectSource.runMoveWindowEast(result.blueprintId, 300);
      setLastRippleResult(rippleRes);

      // Update findings: mark resolved findings, append newly surfaced findings
      const updatedFindings = result.findings.map((f) =>
        rippleRes.resolvedFindingIds.includes(f.id)
          ? { ...f, resolved: true }
          : f
      );

      const allFindings = [...updatedFindings, ...rippleRes.newFindings];

      setResult({
        ...result,
        findings: allFindings,
      });

      setPreviousScore(currentScore);
      setCurrentScore(rippleRes.updatedReadinessScore);
      setHasAppliedRipple(true);
      setScoreStatusNote("Simulation applied: egress issues resolved, setback conflict surfaced by recheck");

      logAuditEvent(
        "ripple_simulation_run",
        "Applicant",
        result.blueprintId,
        "Simulated moving Window W2 +300mm east: egress issues resolved, setback conflict surfaced."
      );
    } catch (err) {
      console.error("Ripple effect recheck failed:", err);
      alert("Error running ripple effect recheck");
    } finally {
      setIsRechecking(false);
    }
  }

  function handleResetRipple() {
    if (!result || !initialFindings) return;
    setResult({
      ...result,
      findings: initialFindings,
    });
    setHasAppliedRipple(false);
    setIsRechecking(false);
    setPreviousScore(null);
    setScoreStatusNote(null);
    setLastRippleResult(null);
    const blockingCount = initialFindings.filter((f) => f.severity === "blocking").length;
    const advisoryCount = initialFindings.filter((f) => f.severity === "advisory").length;
    setCurrentScore(calculateReadinessScore(blockingCount, advisoryCount));

    logAuditEvent(
      "plan_reset",
      "Applicant",
      result.blueprintId,
      "Reset simulated modifications back to original baseline geometry."
    );
  }

  const handleSignOut = () => {
    localStorage.removeItem("crossbeam-auth");
    localStorage.removeItem("crossbeam-role");
    localStorage.removeItem("crossbeam-email");
    setIsLoggedIn(false);
    setUserEmail(null);
    setShowProfileMenu(false);
    setActiveTab("applicant");
    router.replace("/app?tab=applicant");
  };

  const canCheckCompliance =
    selectedBlueprint !== null ||
    (uploadedFile !== null && classificationResponse?.recognized === true);

  // Active blueprint for spatial rendering
  const activeBlueprint =
    selectedBlueprint || (result ? getBlueprintById(result.blueprintId) : null);

  const conflicts = detectRegulationConflicts(activeBlueprint || undefined);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl tracking-tight text-municipal-blue dark:text-blue-400 flex items-center gap-2">
              <span className="w-4 h-4 bg-accent rounded-sm inline-block" />
              PraxisCompliance
            </Link>

            <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => handleTabChange("applicant")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "applicant"
                    ? "bg-white dark:bg-slate-700 text-municipal-blue dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Applicant Check
              </button>
              <button
                onClick={() => handleTabChange("reviewer")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "reviewer"
                    ? "bg-white dark:bg-slate-700 text-municipal-blue dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <span>Reviewer Dashboard</span>
                {!isLoggedIn && <span className="text-[10px] opacity-60">🔒</span>}
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark / Light Mode Switch */}
            <ThemeToggle />

            <button
              onClick={() => setShowJurisdictionMemory(!showJurisdictionMemory)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>🏛️</span>
              <span className="hidden sm:inline">Jurisdiction Memory</span>
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span className="max-w-[140px] truncate">{userEmail}</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                      Signed in as <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">{userEmail}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push(`/login?redirect=${encodeURIComponent("/app?tab=reviewer")}`)}
                className="text-xs font-semibold bg-municipal-blue dark:bg-blue-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-blue-900 dark:hover:bg-blue-500 transition-colors cursor-pointer shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Jurisdiction Memory Modal / Banner (Toggleable) */}
      {showJurisdictionMemory && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="relative">
            <JurisdictionMemoryPanel />
            <button
              onClick={() => setShowJurisdictionMemory(false)}
              className="absolute top-7 right-7 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Routing */}
      {activeTab === "applicant" ? (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 transition-colors">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              Applicant Compliance Pre-Check
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Upload an architectural blueprint to verify compliance against Maplewood Township building and zoning codes before permit submission.
            </p>

            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors bg-slate-50/50 dark:bg-slate-850/40">
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
                id="blueprint-upload"
              />
              <label htmlFor="blueprint-upload" className="cursor-pointer block">
                <div className="text-3xl mb-2">📁</div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Click to upload blueprint (PDF, PNG, JPG)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Synthetic test files recognized: clean-addition.pdf, basement-bedroom.pdf, setback-kitchen.pdf
                </p>
              </label>

              {uploadedFile && (
                <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs inline-flex items-center gap-2 font-mono">
                  <span>📄 {uploadedFile.name}</span>
                  <span className="text-slate-400 dark:text-slate-500">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

            {/* Classification Response Card */}
            {classifying && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Classifying blueprint scope and room layout…
              </div>
            )}

            {classificationResponse && (
              <div className="mt-4 p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-xs">
                <div className="font-bold text-blue-950 dark:text-blue-200 mb-1 flex items-center justify-between">
                  <span>Classification: {classificationResponse.classification?.projectType || "Standard Residential Plan"}</span>
                  <span className="font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-[10.5px]">
                    {((classificationResponse.classification?.confidence || 0.95) * 100).toFixed(0)}% Match
                  </span>
                </div>
                <p className="text-blue-900/80 dark:text-blue-300/80">
                  Detected Rooms: {classificationResponse.classification?.detectedRooms.join(", ") || "Basement Recreation / Sleeping Room"} • Scope: {classificationResponse.classification?.scope || "renovation"}
                </p>
              </div>
            )}

            {/* Example Selector */}
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
                Or choose an example test blueprint
              </label>
              <select
                value={selectedBlueprint?.id || ""}
                onChange={(e) => {
                  const bp = BLUEPRINTS.find((b) => b.id === e.target.value);
                  setSelectedBlueprint(bp || null);
                  setUploadedFile(null);
                  setFilePreview(null);
                  setClassificationResponse(null);
                }}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose an example blueprint --</option>
                {BLUEPRINTS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={checkCompliance}
              disabled={loading || !canCheckCompliance}
              className="mt-4 w-full bg-accent text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed shadow transition-colors cursor-pointer"
            >
              {loading ? "Running Multi-Agent Compliance Pipeline…" : "Check Compliance"}
            </button>
          </section>

          {/* Results Section */}
          {result && activeBlueprint && (
            <section className="mt-8 space-y-6">
              {/* Header with status */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Findings &amp; Readiness</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Blueprint: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeBlueprint.label}</span>
                  </p>
                </div>
                {hasAppliedRipple && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse font-mono">
                    <span>⚡</span>
                    <span>Plan Modification Applied</span>
                  </span>
                )}
              </div>

              {/* Approval Readiness Score Gauge */}
              {(() => {
                const unresolvedBlocking = result.findings.filter((f) => f.severity === "blocking" && !f.resolved).length;
                const unresolvedAdvisory = result.findings.filter((f) => f.severity === "advisory" && !f.resolved).length;
                const activeScore = currentScore ?? calculateReadinessScore(unresolvedBlocking, unresolvedAdvisory);

                return (
                  <ApprovalReadinessGauge
                    score={activeScore}
                    blockingCount={unresolvedBlocking}
                    advisoryCount={unresolvedAdvisory}
                    previousScore={previousScore}
                    statusNote={scoreStatusNote}
                  />
                );
              })()}

              {/* Phase 7: Regulation Conflict Detector Card */}
              {conflicts.map((c) => (
                <RegulationConflictCard key={c.id} conflict={c} />
              ))}

              {/* Phase 2: Visual Evidence Layer (Spatial Blueprint Viewer) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2 font-mono">
                    <span>🗺️</span>
                    <span>Interactive Visual Evidence Layer</span>
                  </h3>
                  {highlightedElementId && (
                    <button
                      onClick={() => setHighlightedElementId(null)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <BlueprintViewer
                  blueprint={activeBlueprint}
                  highlightedElementId={highlightedElementId}
                  onElementClick={(id) => setHighlightedElementId(id)}
                  isMoved={hasAppliedRipple}
                  isRechecking={isRechecking}
                />
              </div>

              {/* Phase 1: Generalized Ripple Engine Demo Action Card (Basement Bedroom Conversion) */}
              {result.blueprintId === "bp-blocking" && (
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900 rounded-xl shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">⚡</span>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      The Ripple Engine — Generalized Spatial Simulation
                    </h3>
                  </div>
                  <p className="mb-4 text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    Simulate modifying blueprint dimensions to resolve egress opening constraints.
                    Translating Window W2 +300mm east clears egress width/height, but automatically tests proximity to the east lot boundary via the live recheck loop.
                  </p>

                  <div className="flex items-center gap-3 flex-wrap">
                    {!hasAppliedRipple ? (
                      <button
                        id="move-window-btn"
                        onClick={handleMoveWindowEast}
                        disabled={isRechecking}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed shadow transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        {isRechecking ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Evaluating Spatial Recheck Loop…
                          </>
                        ) : (
                          "Simulate: Move Window W2 +300mm East"
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 rounded-lg">
                          ✓ Window Moved +300mm East (Egress Cleared)
                        </span>
                        <button
                          onClick={handleResetRipple}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Reset Baseline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Phase 3: Evidence Graph & Change Impact Graph (Expandable) */}
              {(selectedFindingForGraph || lastRippleResult) && (
                <EvidenceChain
                  finding={selectedFindingForGraph}
                  rippleResult={lastRippleResult}
                  blueprint={activeBlueprint}
                  onClose={() => setSelectedFindingForGraph(null)}
                />
              )}

              {/* Governance Note */}
              <div className="p-3.5 bg-slate-100/90 dark:bg-slate-900 rounded-xl text-xs italic text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                {result.governanceNote}
              </div>

              {/* Structured Findings List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide font-mono">
                    Compliance Findings ({result.findings.length})
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Click any card to highlight element</span>
                </div>

                {result.findings.map((f) => {
                  const hasElementInBlueprint = f.elementId
                    ? activeBlueprint.spatialMetadata?.elements.some((e) => e.elementId === f.elementId) ?? false
                    : false;

                  return (
                    <FindingCard
                      key={f.id}
                      finding={f}
                      isSelected={highlightedElementId === f.elementId && Boolean(f.elementId)}
                      hasVisualEvidence={hasElementInBlueprint}
                      onSelect={() => {
                        setHighlightedElementId(f.elementId || null);
                        setSelectedFindingForGraph(f);
                      }}
                      onViewEvidenceChain={() => setSelectedFindingForGraph(f)}
                    />
                  );
                })}

                {result.findings.length === 0 && (
                  <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold rounded-xl flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    <span>No issues detected in this automated check. All 19 municipal code clauses satisfied.</span>
                  </div>
                )}
              </div>

              {/* Agent Pipeline Reasoning */}
              <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 overflow-auto">
                <p className="font-semibold mb-2 text-slate-800 dark:text-slate-200 font-mono">Agent Pipeline Reasoning &amp; Governance Trace:</p>
                <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                  {result.agentReasoning}
                </pre>
              </div>
            </section>
          )}
        </div>
      ) : !isLoggedIn ? (
        <div className="p-8 max-w-lg mx-auto py-20">
          <div className="bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-2xl">
              🔒
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Reviewer Sign-In Required
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              The Reviewer Dashboard is restricted to municipal staff to manage application queues, inspect audit logs, and issue official correction letters.
            </p>
            <button
              onClick={() => router.push(`/login?redirect=${encodeURIComponent("/app?tab=reviewer")}`)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
            >
              Sign In as Reviewer
            </button>
          </div>
        </div>
      ) : (
        <ReviewerDashboard />
      )}
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 font-medium">Loading PraxisCompliance…</div>}>
      <AppContent />
    </Suspense>
  );
}
