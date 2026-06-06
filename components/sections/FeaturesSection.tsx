"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  LineChart,
  ShieldCheck,
  BarChart3,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Risk Prediction",
    description:
      "Machine learning model trained on the UCI Heart Disease dataset analyzes 13 clinical markers to predict cardiovascular risk with high precision.",
    color: "#F2545B",
  },
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description:
      "Instant processing of your health data with sub-second response times. No waiting — your results are generated the moment you complete the form.",
    color: "#DCEDFF",
  },
  {
    icon: LineChart,
    title: "Personalized Health Insights",
    description:
      "Receive tailored recommendations for lifestyle, exercise, and nutrition based on your specific risk profile and clinical markers.",
    color: "#F2545B",
  },
  {
    icon: ShieldCheck,
    title: "Secure Data Processing",
    description:
      "All health data is processed in-memory with no persistent storage. Your sensitive information never leaves your session without your consent.",
    color: "#10b981",
  },
  {
    icon: BarChart3,
    title: "Advanced Risk Visualization",
    description:
      "Interactive charts and a dynamic 3D heart visualization help you understand your risk profile at a glance — not just a number.",
    color: "#f59e0b",
  },
  {
    icon: Activity,
    title: "Predictive Health Monitoring",
    description:
      "Understand which factors contribute most to your risk and track how changes to lifestyle markers would affect your overall score.",
    color: "#ef4444",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: "100px 40px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: 72 }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 100,
            border: "1px solid rgba(242,84,91,0.35)",
            background: "rgba(242,84,91,0.08)",
            fontSize: 13,
            fontWeight: 600,
            color: "#F2545B",
            marginBottom: 20,
            letterSpacing: "0.02em",
          }}
        >
          Platform Capabilities
        </div>
        <h2
          style={{
            fontSize: "clamp(30px, 3.5vw, 46px)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "#f0f4ff",
            marginBottom: 16,
          }}
        >
          Clinical-grade tools built for{" "}
          <span className="gradient-text">understanding your heart</span>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "rgba(168,180,207,0.85)",
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          Every feature is designed with medical relevance in mind — not
          aesthetics alone.
        </p>
      </motion.div>

      {/* Feature grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 20,
        }}
      >
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.08,
              }}
              className="card-hover"
              style={{
                background: "rgba(13,20,36,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "32px 28px",
                cursor: "default",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${feature.color}18`,
                  border: `1px solid ${feature.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <Icon size={22} color={feature.color} strokeWidth={1.8} />
              </div>

              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#f0f4ff",
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: 14.5,
                  color: "rgba(168,180,207,0.8)",
                  lineHeight: 1.65,
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
