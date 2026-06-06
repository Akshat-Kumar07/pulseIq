"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const HeartScene = dynamic(() => import("@/components/heart/HeartScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 560,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="skeleton"
        style={{ width: 300, height: 300, borderRadius: "50%" }}
      />
    </div>
  ),
});

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "120px 40px 80px",
        gap: 40,
        position: "relative",
      }}
    >
      {/* Left — Content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 100,
            border: "1px solid rgba(59,130,246,0.35)",
            background: "rgba(59,130,246,0.08)",
            fontSize: 13,
            fontWeight: 600,
            color: "#60a5fa",
            marginBottom: 28,
            letterSpacing: "0.02em",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 8px #10b981",
              display: "inline-block",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          AI-Powered Clinical Analysis
        </motion.div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(38px, 4.5vw, 62px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "#f0f4ff",
            marginBottom: 24,
          }}
        >
          Predict Heart Disease{" "}
          <span className="gradient-text">Risk with AI</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: "clamp(16px, 1.8vw, 19px)",
            lineHeight: 1.7,
            color: "rgba(168, 180, 207, 0.9)",
            maxWidth: 480,
            marginBottom: 48,
          }}
        >
          Advanced machine learning–powered cardiovascular risk assessment
          with real-time insights and personalized clinical recommendations.
          Built on validated clinical data.
        </p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          <Link
            href="/assessment"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "white",
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(59,130,246,0.4)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(59,130,246,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(59,130,246,0.4)";
            }}
          >
            Start Assessment
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/#how-it-works"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 24px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(240,244,255,0.85)",
              fontSize: 16,
              fontWeight: 500,
              textDecoration: "none",
              backdropFilter: "blur(10px)",
              transition: "border-color 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
          >
            <Play size={15} style={{ fill: "currentColor" }} />
            View Demo
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "UCI", label: "Dataset validated" },
            { value: "HIPAA", label: "Privacy compliant" },
            { value: "13", label: "Clinical markers" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#60a5fa",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.value}
              </span>
              <span style={{ fontSize: 13, color: "rgba(107,123,158,0.9)" }}>
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right — 3D Heart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{ position: "relative" }}
      >
        <HeartScene height={580} interactive={true} />

        {/* Floating stat cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: "absolute",
            bottom: 80,
            right: -20,
            background: "rgba(13,20,36,0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: "14px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11, color: "#6b7b9e", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Analysis Mode
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#10b981" }}>
            ● Real-time active
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{
            position: "absolute",
            top: 100,
            left: -30,
            background: "rgba(13,20,36,0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: "14px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11, color: "#6b7b9e", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Accuracy
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#60a5fa" }}>
            Clinical grade
          </span>
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          #hero {
            grid-template-columns: 1fr !important;
            text-align: center;
            padding: 100px 24px 60px !important;
          }
          #hero > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          #hero p {
            text-align: center;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
