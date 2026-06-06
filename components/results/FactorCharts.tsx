"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from "recharts";
import type { PredictionResult, RiskFactor } from "@/features/prediction/types";

const impactColors = {
  negative: "#ef4444",
  positive: "#10b981",
  neutral: "#f59e0b",
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: RiskFactor }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const factor = payload[0].payload as RiskFactor;
  return (
    <div
      style={{
        background: "rgba(13,20,36,0.97)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "12px 16px",
        maxWidth: 200,
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>
        {factor.name}
      </p>
      <p style={{ fontSize: 12, color: "#6b7b9e", marginBottom: 6, lineHeight: 1.4 }}>
        {factor.description}
      </p>
      <p style={{ fontSize: 12, color: "#a8b4cf" }}>
        Value: <span style={{ fontWeight: 600, color: "#f0f4ff" }}>{factor.value}</span>
      </p>
      <p style={{ fontSize: 12, color: "#a8b4cf" }}>
        Impact weight:{" "}
        <span style={{ fontWeight: 600, color: impactColors[factor.impact] }}>
          {factor.weight}%
        </span>
      </p>
    </div>
  );
}

export default function FactorCharts({ result }: { result: PredictionResult }) {
  const topFactors = result.factors.slice(0, 7);

  // Radar data for health metrics
  const radarData = result.metrics.map((m) => {
    // Normalize user value relative to healthy range
    const healthyMid = (m.healthyMin + m.healthyMax) / 2;
    const deviation = Math.abs(m.userValue - healthyMid);
    const range = Math.max(m.healthyMax - m.healthyMin, 1);
    const score = Math.max(0, 100 - (deviation / range) * 60);
    return {
      metric: m.name,
      score: Math.round(score),
      fullMark: 100,
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Contributing Factors */}
      <div
        style={{
          background: "rgba(13,20,36,0.7)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "24px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "#6b7b9e",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Contributing Factors
        </p>
        <p style={{ fontSize: 13, color: "rgba(107,123,158,0.8)", marginBottom: 20, lineHeight: 1.5 }}>
          Risk-weighted clinical markers from your assessment, sorted by impact.
        </p>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={topFactors}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: "#6b7b9e", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickCount={5}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#a8b4cf", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="weight" radius={[0, 6, 6, 0]} maxBarSize={18}>
              {topFactors.map((factor, i) => (
                <Cell
                  key={i}
                  fill={impactColors[factor.impact]}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
          {Object.entries(impactColors).map(([key, color]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
              <span style={{ fontSize: 12, color: "#6b7b9e", textTransform: "capitalize" }}>{key} impact</span>
            </div>
          ))}
        </div>
      </div>

      {/* Radar chart */}
      <div
        style={{
          background: "rgba(13,20,36,0.7)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "24px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "#6b7b9e",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Metric Health Profile
        </p>
        <p style={{ fontSize: 13, color: "rgba(107,123,158,0.8)", marginBottom: 16, lineHeight: 1.5 }}>
          How close your key metrics are to the healthy reference range (100 = optimal).
        </p>

        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "#a8b4cf", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#6b7b9e", fontSize: 10 }}
            />
            <Radar
              name="Your Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.18}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(13,20,36,0.97)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#f0f4ff",
                fontSize: 13,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
