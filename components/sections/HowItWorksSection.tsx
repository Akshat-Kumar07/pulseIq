"use client";

import { motion } from "framer-motion";
import { ClipboardList, Cpu, BarChart2 } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Complete the Clinical Assessment",
    description:
      "Answer 13 evidence-based clinical questions across four guided steps. Each question maps to a validated cardiovascular risk marker.",
    color: "#F2545B",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Processes Your Data",
    description:
      "Our machine learning model — trained on the UCI Heart Disease dataset — analyzes your profile and computes a probabilistic risk score.",
    color: "#DCEDFF",
  },
  {
    number: "03",
    icon: BarChart2,
    title: "Receive Your Clinical Report",
    description:
      "View your personalized risk dashboard with factor analysis, interactive charts, and actionable recommendations from your care team.",
    color: "#F2545B",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "100px 40px",
        background: "rgba(13,20,36,0.5)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
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
            How It Works
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: "#f0f4ff",
              marginBottom: 16,
            }}
          >
            From assessment to{" "}
            <span className="gradient-text">clinical insight</span> in minutes
          </h2>
        </motion.div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
            position: "relative",
          }}
        >
          {/* Connector line */}
          <div
            style={{
              position: "absolute",
              top: 36,
              left: "calc(16.67% + 24px)",
              right: "calc(16.67% + 24px)",
              height: 1,
              background: "linear-gradient(90deg, rgba(242, 84, 91, 0.3), rgba(220, 237, 255, 0.3), rgba(242, 84, 91, 0.15))",
            }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 16px",
                }}
              >
                {/* Icon ring */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: `${step.color}14`,
                    border: `2px solid ${step.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 28,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Icon size={28} color={step.color} strokeWidth={1.6} />
                </div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: step.color,
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                    textTransform: "uppercase",
                  }}
                >
                  Step {step.number}
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#f0f4ff",
                    marginBottom: 12,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "rgba(168,180,207,0.8)",
                    lineHeight: 1.65,
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ textAlign: "center", marginTop: 60 }}
        >
          <Link
            href="/assessment"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #F2545B, #DCEDFF)",
              color: "#080b14",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(242,84,91,0.4)",
            }}
          >
            Begin Your Assessment
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #how-it-works > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          #how-it-works > div > div:nth-child(2) > div:first-child {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
