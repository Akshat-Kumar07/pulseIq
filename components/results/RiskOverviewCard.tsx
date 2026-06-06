"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { PredictionResult } from "@/features/prediction/types";
import { getRiskColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Shield } from "lucide-react";

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number>(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        raf.current = requestAnimationFrame(update);
      }
    };

    raf.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return <>{count}</>;
}

export default function RiskOverviewCard({ result }: { result: PredictionResult }) {
  const riskColor = getRiskColor(result.riskCategory);

  const riskConfig = {
    low: {
      label: "Low Risk",
      description: "Your cardiovascular risk appears low based on the provided clinical markers. Continue maintaining your healthy habits.",
      Icon: TrendingDown,
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
    },
    moderate: {
      label: "Moderate Risk",
      description: "Your cardiovascular risk is in the moderate range. Targeted lifestyle modifications and medical follow-up are recommended.",
      Icon: Minus,
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
    },
    high: {
      label: "High Risk",
      description: "Your cardiovascular risk is elevated. Please consult a cardiologist promptly and review the recommendations below.",
      Icon: TrendingUp,
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.2)",
    },
  };

  const config = riskConfig[result.riskCategory];
  const Icon = config.Icon;

  return (
    <div
      style={{
        background: "rgba(13,20,36,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "32px 36px",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 32,
        alignItems: "center",
      }}
    >
      {/* Left content */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 100,
              background: config.bg,
              border: `1px solid ${config.border}`,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Icon size={14} color={riskColor} strokeWidth={2.5} />
            <span style={{ fontSize: 13, fontWeight: 700, color: riskColor }}>
              {config.label}
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: 14.5,
            color: "rgba(168,180,207,0.85)",
            lineHeight: 1.65,
            maxWidth: 540,
            marginBottom: 24,
          }}
        >
          {config.description}
        </p>

        {/* Metrics row */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 12, color: "#6b7b9e", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
              Risk Score
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: riskColor, letterSpacing: "-0.02em" }}>
                <AnimatedCounter target={result.riskScore} />
              </span>
              <span style={{ fontSize: 20, fontWeight: 600, color: riskColor }}>/100</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 12, color: "#6b7b9e", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
              Confidence
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: "#f0f4ff", letterSpacing: "-0.02em" }}>
                <AnimatedCounter target={result.confidence} />
              </span>
              <span style={{ fontSize: 20, fontWeight: 600, color: "#a8b4cf" }}>%</span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 12, color: "#6b7b9e", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
              Risk Band
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                {[
                  { label: "Low", color: "#10b981", active: result.riskCategory === "low" },
                  { label: "Moderate", color: "#f59e0b", active: result.riskCategory === "moderate" },
                  { label: "High", color: "#ef4444", active: result.riskCategory === "high" },
                ].map((band) => (
                  <div
                    key={band.label}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: band.active ? 700 : 500,
                      background: band.active ? `${band.color}20` : "rgba(255,255,255,0.04)",
                      color: band.active ? band.color : "#6b7b9e",
                      border: band.active ? `1px solid ${band.color}40` : "1px solid transparent",
                    }}
                  >
                    {band.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `conic-gradient(${riskColor} ${result.riskScore * 3.6}deg, rgba(26,37,64,0.6) 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "#0d1424",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Shield size={20} color={riskColor} />
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#6b7b9e", fontWeight: 500 }}>Model confidence</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff" }}>{result.confidence}%</p>
        </div>
      </div>
    </div>
  );
}
