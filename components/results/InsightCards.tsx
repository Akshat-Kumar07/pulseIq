"use client";

import { motion } from "framer-motion";
import type { AIInsight } from "@/features/prediction/types";
import { Heart, Dumbbell, Salad, Stethoscope, ChevronRight } from "lucide-react";

const categoryConfig = {
  lifestyle: {
    icon: Heart,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    label: "Lifestyle",
  },
  exercise: {
    icon: Dumbbell,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.2)",
    label: "Exercise",
  },
  nutrition: {
    icon: Salad,
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    label: "Nutrition",
  },
  medical: {
    icon: Stethoscope,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    label: "Medical",
  },
};

const priorityBadge = {
  high: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "High Priority" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "Recommended" },
  low: { color: "#10b981", bg: "rgba(16,185,129,0.1)", label: "Advisory" },
};

export default function InsightCards({ insights }: { insights: AIInsight[] }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
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
          Personalized Recommendations
        </p>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#f0f4ff",
            letterSpacing: "-0.02em",
          }}
        >
          Your AI-Generated Health Insights
        </h2>
        <p style={{ fontSize: 14, color: "#6b7b9e", marginTop: 6 }}>
          These recommendations are generated based on your specific risk profile and clinical markers.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
        }}
      >
        {insights.map((insight, i) => {
          const config = categoryConfig[insight.category];
          const Icon = config.icon;
          const pBadge = priorityBadge[insight.priority];

          return (
            <motion.div
              key={insight.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                background: "rgba(13,20,36,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "24px",
                transition: "border-color 0.25s, transform 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${config.color}30`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 11,
                      background: config.bg,
                      border: `1px solid ${config.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color={config.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "#6b7b9e", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {config.label}
                    </p>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginTop: 2 }}>
                      {insight.title}
                    </h3>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: pBadge.color,
                    background: pBadge.bg,
                    padding: "3px 10px",
                    borderRadius: 100,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {pBadge.label}
                </span>
              </div>

              {/* Recommendations list */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {insight.recommendations.map((rec, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <ChevronRight
                      size={14}
                      color={config.color}
                      style={{ flexShrink: 0, marginTop: 3 }}
                    />
                    <span style={{ fontSize: 13.5, color: "rgba(168,180,207,0.85)", lineHeight: 1.6 }}>
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .insight-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
