"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import type { PredictionResult } from "@/features/prediction/types";
import { getRiskColor } from "@/lib/utils";
import { useAssessmentStore } from "@/features/assessment/store";
import { ArrowLeft } from "lucide-react";

const HeartScene = dynamic(() => import("@/components/heart/HeartScene"), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ width: "100%", height: 320, borderRadius: 16 }} />,
});

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ target, decimals = 0, suffix = "" }: { target: number; decimals?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1600;
    const update = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((eased * target).toFixed(decimals)));
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [target, decimals]);
  return <>{val.toFixed(decimals)}{suffix}</>;
}

// ─── Probability bar ──────────────────────────────────────────────────────────

function ProbabilityBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.round(value * 100 * 10) / 10;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#a8b4cf" }}>{label}</span>
        <span style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: "-0.02em" }}>
          <AnimatedNumber target={pct} decimals={1} suffix="%" />
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ height: "100%", borderRadius: 4, background: color, boxShadow: `0 0 8px ${color}80` }}
        />
      </div>
    </div>
  );
}

// ─── Risk gauge ───────────────────────────────────────────────────────────────

function RiskGauge({ score, category }: { score: number; category: string }) {
  const [animated, setAnimated] = useState(0);
  const riskColor = getRiskColor(category as "low" | "moderate" | "high");

  useEffect(() => {
    const start = performance.now();
    const dur = 1800;
    const update = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setAnimated(Math.round((1 - Math.pow(1 - p, 3)) * score));
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [score]);

  const size = 200, sw = 14, r = (size - sw) / 2, cx = size / 2;
  const arc = 240, sa = 150;

  function polar(a: number) {
    const rad = ((a - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cx + r * Math.sin(rad) };
  }
  function describeArc(s: number, e: number) {
    const sp = polar(s), ep = polar(e);
    return `M ${sp.x} ${sp.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${ep.x} ${ep.y}`;
  }
  const circ = (arc / 360) * 2 * Math.PI * r;
  const filled = (animated / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        <path d={describeArc(sa, sa + arc)} fill="none" stroke="rgba(26,37,64,0.8)" strokeWidth={sw} strokeLinecap="round" />
        <path d={describeArc(sa, sa + arc)} fill="none" stroke={riskColor} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${circ}`} strokeDashoffset={circ - filled}
          style={{ filter: `drop-shadow(0 0 6px ${riskColor}80)` }} />
        <text x={cx} y={cx + 12} textAnchor="middle" fill="#f0f4ff" fontSize={42} fontWeight={800} fontFamily="Inter,sans-serif" letterSpacing="-2">{animated}</text>
        <text x={cx} y={cx + 34} textAnchor="middle" fill={riskColor} fontSize={13} fontWeight={700} fontFamily="Inter,sans-serif">
          {category.charAt(0).toUpperCase() + category.slice(1)} Risk
        </text>
      </svg>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function ResultsDashboard() {
  const router = useRouter();
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("cardioai_result");
    if (!stored) { router.replace("/assessment"); return; }
    try {
      setTimeout(() => { setResult(JSON.parse(stored)); setLoading(false); }, 300);
    } catch { router.replace("/assessment"); }
  }, [router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "120px auto", padding: "0 40px", display: "grid", gap: 20 }}>
        <div className="skeleton" style={{ height: 180, borderRadius: 16 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
        </div>
      </div>
    </div>
  );

  if (!result) return null;

  const riskColor = getRiskColor(result.riskCategory);

  const riskMeta = {
    low:      { desc: "Your cardiovascular risk is low. Continue maintaining your healthy habits and schedule routine checkups.", emoji: "🟢" },
    moderate: { desc: "Your risk is in the moderate range. Targeted lifestyle changes and a medical follow-up are recommended.", emoji: "🟡" },
    high:     { desc: "Your cardiovascular risk is elevated. Please consult a cardiologist promptly.", emoji: "🔴" },
  }[result.riskCategory];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        {/* Page header */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(13,20,36,0.6)", backdropFilter: "blur(20px)",
          padding: "28px 40px",
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ marginBottom: 16 }}>
                <button
                  onClick={() => {
                    useAssessmentStore.getState().reset();
                    sessionStorage.removeItem("cardioai_result");
                    sessionStorage.removeItem("cardioai_formData");
                    router.push("/");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    color: "#a8b4cf",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F2545B")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#a8b4cf")}
                >
                  <ArrowLeft size={14} /> Back to Home
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#6b7b9e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                Assessment Results
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", letterSpacing: "-0.02em" }}>
                  Cardiovascular Risk Report
                </h1>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => {
                    useAssessmentStore.getState().reset();
                    sessionStorage.removeItem("cardioai_result");
                    sessionStorage.removeItem("cardioai_formData");
                    router.push("/assessment");
                  }} style={{
                    padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent", color: "#a8b4cf", fontSize: 13, fontWeight: 500, cursor: "pointer",
                  }}>Retake Assessment</button>
                  <button onClick={() => window.print()} style={{
                    padding: "9px 18px", borderRadius: 9, border: "1px solid rgba(242,84,91,0.3)",
                    background: "rgba(242,84,91,0.1)", color: "#F2545B", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>Download Report</button>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#6b7b9e", marginTop: 8 }}>
                {new Date(result.timestamp).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                {" · "}<span style={{ color: riskColor, fontWeight: 600 }}>{result.label}</span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Dashboard content */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 40px 80px", display: "grid", gap: 24 }}>

          {/* Verdict banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              background: "rgba(13,20,36,0.8)", border: `1px solid ${riskColor}30`,
              borderRadius: 16, padding: "28px 32px",
              boxShadow: `0 0 40px ${riskColor}10`,
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{riskMeta.emoji}</span>
              <span style={{
                fontSize: 18, fontWeight: 800, color: riskColor, letterSpacing: "-0.02em",
              }}>{result.label}</span>
            </div>
            <p style={{ fontSize: 14.5, color: "rgba(168,180,207,0.85)", lineHeight: 1.65, maxWidth: 560 }}>
              {riskMeta.desc}
            </p>
          </motion.div>

          {/* Gauge + Probabilities side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Gauge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{
                background: "rgba(13,20,36,0.7)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
              }}>
              <p style={{ fontSize: 11, color: "#6b7b9e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", alignSelf: "flex-start" }}>
                Risk Score (Derived)
              </p>
              <RiskGauge score={result.riskScore} category={result.riskCategory} />
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
                {[{ l: "Low", c: "#10b981", r: result.riskCategory === "low" }, { l: "Moderate", c: "#f59e0b", r: result.riskCategory === "moderate" }, { l: "High", c: "#ef4444", r: result.riskCategory === "high" }].map(b => (
                  <span key={b.l} style={{
                    fontSize: 12, fontWeight: b.r ? 700 : 400,
                    color: b.r ? b.c : "#6b7b9e",
                    background: b.r ? `${b.c}18` : "transparent",
                    padding: "3px 10px", borderRadius: 100,
                    border: b.r ? `1px solid ${b.c}40` : "none",
                  }}>{b.l}</span>
                ))}
              </div>
            </motion.div>

            {/* Raw API probabilities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              style={{
                background: "rgba(13,20,36,0.7)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16, padding: "28px 28px",
              }}>
              <p style={{ fontSize: 11, color: "#6b7b9e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>
                Model Probabilities
              </p>

              <ProbabilityBar
                label="Heart Disease"
                value={result.probability.heartDisease}
                color="#ef4444"
              />
              <ProbabilityBar
                label="No Heart Disease"
                value={result.probability.noHeartDisease}
                color="#10b981"
              />

              <div style={{ marginTop: 24, padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#6b7b9e" }}>Model Prediction</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: result.prediction === 1 ? "#ef4444" : "#10b981" }}>
                    {result.prediction === 1 ? "Positive (1)" : "Negative (0)"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#6b7b9e" }}>Model Confidence</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f4ff" }}>{result.confidence}%</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3D heart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{
              background: "rgba(13,20,36,0.7)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16, overflow: "hidden",
            }}>
            <div style={{ padding: "20px 24px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: riskColor, boxShadow: `0 0 12px ${riskColor}` }} />
                <p style={{ fontSize: 12, color: "#6b7b9e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Cardiac Visualization · <span style={{ color: riskColor }}>{result.riskCategory.charAt(0).toUpperCase() + result.riskCategory.slice(1)} Risk</span>
                </p>
              </div>
            </div>
            <HeartScene riskColor={riskColor} interactive={false} height={300} />
          </motion.div>

          {/* Medical disclaimer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{
              background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 12, padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start",
            }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <p style={{ fontSize: 13, color: "rgba(252,165,165,0.8)", lineHeight: 1.6 }}>
              <strong style={{ color: "#fca5a5" }}>Medical Disclaimer:</strong> This assessment is for informational and educational purposes only, based on the PulseIQ machine learning model. It is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </motion.div>
        </div>
      </main>

      <style>{`
        @media (max-width: 700px) {
          main > div:last-child > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media print { nav, button { display: none !important; } }
      `}</style>
    </div>
  );
}
