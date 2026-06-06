"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { RiskCategory } from "@/features/prediction/types";
import { getRiskColor } from "@/lib/utils";

interface RiskGaugeProps {
  score: number;
  category: RiskCategory;
}

export default function RiskGauge({ score, category }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const riskColor = getRiskColor(category);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;

    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(update);
    };

    const raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  // SVG arc parameters
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  // 240 degree arc (from 150° to 390°)
  const arcDegrees = 240;
  const startAngle = 150;
  const endAngle = startAngle + arcDegrees;

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const angle = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
    const s = polarToCartesian(cx, cy, r, start);
    const e = polarToCartesian(cx, cy, r, end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const circumference = (arcDegrees / 360) * 2 * Math.PI * radius;
  const filled = (animatedScore / 100) * circumference;

  const zones = [
    { label: "Low", from: 0, to: 35, color: "#10b981" },
    { label: "Moderate", from: 35, to: 60, color: "#f59e0b" },
    { label: "High", from: 60, to: 100, color: "#ef4444" },
  ];

  return (
    <div
      style={{
        background: "rgba(13,20,36,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: "#6b7b9e",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 20,
          alignSelf: "flex-start",
        }}
      >
        Risk Gauge
      </p>

      {/* SVG Gauge */}
      <div style={{ position: "relative", width: size, height: size * 0.75 }}>
        <svg width={size} height={size} style={{ overflow: "visible" }}>
          {/* Background track */}
          <path
            d={describeArc(center, center, radius, startAngle, endAngle)}
            fill="none"
            stroke="rgba(26,37,64,0.8)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored arc fill */}
          <path
            d={describeArc(center, center, radius, startAngle, endAngle)}
            fill="none"
            stroke={riskColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={circumference - filled}
            style={{
              transition: "stroke-dashoffset 0.1s ease",
              filter: `drop-shadow(0 0 6px ${riskColor}80)`,
            }}
          />

          {/* Score text */}
          <text
            x={center}
            y={center + 16}
            textAnchor="middle"
            fill="#f0f4ff"
            fontSize={44}
            fontWeight={800}
            fontFamily="Inter, sans-serif"
            letterSpacing="-2"
          >
            {animatedScore}
          </text>
          <text
            x={center}
            y={center + 40}
            textAnchor="middle"
            fill={riskColor}
            fontSize={14}
            fontWeight={700}
            fontFamily="Inter, sans-serif"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Risk
          </text>

          {/* Zone labels */}
          {[
            { label: "Low", angle: startAngle + 30, color: "#10b981" },
            { label: "Moderate", angle: startAngle + 120, color: "#f59e0b" },
            { label: "High", angle: startAngle + 210, color: "#ef4444" },
          ].map((zone) => {
            const pos = polarToCartesian(center, center, radius + 22, zone.angle);
            return (
              <text
                key={zone.label}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                fill={zone.color}
                fontSize={10}
                fontWeight={600}
                fontFamily="Inter, sans-serif"
                opacity={0.8}
              >
                {zone.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Zone legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {zones.map((zone) => (
          <div key={zone.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: zone.color,
                opacity: category === zone.label.toLowerCase() ? 1 : 0.4,
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: category === zone.label.toLowerCase() ? zone.color : "#6b7b9e",
                fontWeight: category === zone.label.toLowerCase() ? 600 : 400,
              }}
            >
              {zone.label} ({zone.from}–{zone.to})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
