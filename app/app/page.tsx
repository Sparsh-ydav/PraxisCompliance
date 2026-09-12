"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Blueprint } from "@/fixtures/blueprints";
import { BLUEPRINTS } from "@/fixtures/blueprints";
import FindingCard from "@/app/components/FindingCard";
import ReviewerDashboard from "@/app/components/ReviewerDashboard";
import type { ComplianceResult } from "@/lib/schemas";

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
        setFilePreview("PDF file loaded (preview not available in this demo)");
      } else if (file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            setFilePreview(JSON.stringify(json, null, 2));
          } catch {
            setFilePreview("Invalid JSON file");
          }
        };
        reader.readAsText(file);
      } else {
        setFilePreview("File loaded: " + file.name);
      }

      // Classify the file
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

    const res = await fetch("/api/compliance-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blueprintId }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  // Determine if compliance check can proceed
  const canCheckCompliance =
    selectedBlueprint !== null ||
    (uploadedFile !== null && classificationResponse?.recognized === true);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Tab Navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-municipal-blue">
            PraxisCompliance
          </Link>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => handleTabChange("applicant")}
              className={`px-5 py-2 font-semibold rounded-t transition-colors ${
                activeTab === "applicant"
                  ? "bg-accent text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              Applicant Check
            </button>
            <button
              onClick={() => handleTabChange("reviewer")}
              className={`px-5 py-2 font-semibold rounded-t transition-colors flex items-center gap-1.5 ${
                activeTab === "reviewer"
                  ? "bg-accent text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {!isLoggedIn && <span className="text-xs opacity-75">🔒</span>}
              Reviewer Dashboard
            </button>
            <div className="relative ml-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-9 h-9 rounded-full bg-municipal-blue text-white flex items-center justify-center text-sm font-bold hover:bg-blue-800 transition-colors"
                    aria-label="User profile"
                  >
                    {userEmail ? userEmail[0].toUpperCase() : "U"}
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded shadow-lg py-2 w-56 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {userEmail || "Demo User"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {localStorage.getItem("crossbeam-role") || "demo"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          localStorage.removeItem("crossbeam-auth");
                          localStorage.removeItem("crossbeam-role");
                          localStorage.removeItem("crossbeam-email");
                          setIsLoggedIn(false);
                          setShowProfileMenu(false);
                          router.push("/");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login?redirect=/app"
                  className="text-sm font-semibold text-signature-ink bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "applicant" ? (
        <div className="p-8 max-w-4xl mx-auto">
          <section className="bg-white p-6 rounded shadow mb-8">
            <label className="block text-sm font-medium mb-2">Upload Blueprint Plan</label>
            <div className="border-2 border-dashed border-slate-300 rounded p-6 text-center hover:border-accent transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".json,.pdf,.png,.jpg,.jpeg"
              />
              <label htmlFor="file-upload" className="cursor-pointer text-accent font-semibold">
                {uploadedFile
                  ? `✓ Selected: ${uploadedFile.name}`
                  : "Click to upload blueprint plan"}
              </label>
            </div>

            {/* File Classification Section */}
            {uploadedFile && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* File Preview */}
                <div className="p-4 bg-slate-50 border rounded">
                  <h3 className="font-semibold text-sm mb-2">File Preview:</h3>
                  {uploadedFile?.type.startsWith("image/") && filePreview ? (
                    <img
                      src={filePreview}
                      alt="Blueprint preview"
                      className="max-w-full h-auto max-h-64 mx-auto"
                    />
                  ) : (
                    <pre className="text-xs overflow-auto max-h-64 whitespace-pre-wrap">
                      {filePreview}
                    </pre>
                  )}
                </div>

                {/* AI Classification */}
                <div
                  className={`p-4 border rounded ${
                    classificationResponse?.recognized
                      ? "bg-accent-light border-accent"
                      : "bg-slate-100 border-slate-400"
                  }`}
                >
                  <h3
                    className={`font-semibold text-sm mb-3 flex items-center gap-2 ${
                      classificationResponse?.recognized ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {classifying ? (
                      <>
                        <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                        Analyzing Blueprint...
                      </>
                    ) : classificationResponse?.recognized ? (
                      <>
                        <span className="inline-block w-2 h-2 bg-success rounded-full"></span>
                        AI Classification
                      </>
                    ) : (
                      <>
                        <span className="inline-block w-2 h-2 bg-slate-400 rounded-full"></span>
                        Unable to Classify
                      </>
                    )}
                  </h3>

                  {classifying ? (
                    <p className="text-sm text-muted">Analyzing blueprint...</p>
                  ) : classificationResponse?.recognized && classificationResponse.classification ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold">Project Type:</span>
                        <p className="text-slate-700">
                          {classificationResponse.classification.projectType}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold">Scope:</span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                            classificationResponse.classification.scope === "major"
                              ? "bg-blocking text-white"
                              : classificationResponse.classification.scope === "moderate"
                              ? "bg-advisory text-white"
                              : "bg-success text-white"
                          }`}
                        >
                          {classificationResponse.classification.scope.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Detected Rooms:</span>
                        <p className="text-slate-700">
                          {classificationResponse.classification.detectedRooms.join(", ")}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold">Estimated Area:</span>
                        <p className="text-slate-700">
                          {classificationResponse.classification.estimatedArea}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold">Likely Issues:</span>
                        <ul className="list-disc list-inside text-slate-700 text-xs mt-1">
                          {classificationResponse.classification.likelyIssues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-xs text-muted">
                          Confidence:{" "}
                          {(classificationResponse.classification.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm text-slate-600">
                      <p>This file doesn't match a recognized blueprint format for this demo.</p>
                      <p className="text-xs">
                        In production, PraxisCompliance would run full vision-based extraction on any
                        submitted blueprint. For this MVP, please select one of the example
                        blueprints below, or upload a file with keywords like "basement",
                        "kitchen", "setback", "clean", or "blocking" in the filename.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <label className="block text-sm font-medium mb-2">Or select example blueprint</label>
              <select
                value={selectedBlueprint?.id || ""}
                onChange={(e) => {
                  const bp = BLUEPRINTS.find((b) => b.id === e.target.value);
                  setSelectedBlueprint(bp || null);
                  setUploadedFile(null);
                  setFilePreview(null);
                  setClassificationResponse(null);
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Choose an example --</option>
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
              title={
                !canCheckCompliance
                  ? "Please upload a recognized blueprint file or select an example"
                  : ""
              }
              className="mt-4 w-full bg-accent text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Check Compliance"}
            </button>

            {uploadedFile && classificationResponse?.recognized === false && (
              <p className="mt-2 text-xs text-muted text-center">
                ⚠️ Compliance check disabled: file not recognized as a blueprint
              </p>
            )}
          </section>

          {result && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Findings</h2>

              <div className="mb-4 p-4 bg-slate-100 rounded text-sm italic">
                {result.governanceNote}
              </div>

              <div className="space-y-4">
                {result.findings.map((f) => (
                  <FindingCard key={f.id} finding={f} />
                ))}
                {result.findings.length === 0 && (
                  <div className="p-4 bg-success-bg border border-success text-success font-bold rounded">
                    ✓ No issues detected in this automated check.
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 bg-slate-50 border rounded text-xs text-muted overflow-auto">
                <p className="font-semibold mb-2">Agent Pipeline Reasoning:</p>
                <pre className="whitespace-pre-wrap">{result.agentReasoning}</pre>
              </div>
            </section>
          )}
        </div>
      ) : !isLoggedIn ? (
        <div className="p-8 max-w-lg mx-auto py-20">
          <div className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-2xl">
              🔒
            </div>
            <h2 className="text-2xl font-bold text-municipal-blue mb-2">
              Reviewer Sign-In Required
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              The Reviewer Dashboard is restricted to municipal staff to manage application queues and issue official correction letters.
            </p>
            <button
              onClick={() => router.push(`/login?redirect=${encodeURIComponent("/app?tab=reviewer")}`)}
              className="w-full bg-signature-ink text-white py-3 px-4 rounded font-medium hover:bg-blue-700 transition-colors cursor-pointer"
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading...</div>}>
      <AppContent />
    </Suspense>
  );
}
