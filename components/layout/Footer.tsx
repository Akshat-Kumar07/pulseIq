"use client";

import Link from "next/link";
import { Activity, ExternalLink, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="about"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "60px 40px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 48,
          marginBottom: 48,
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Activity size={16} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#f0f4ff", letterSpacing: "-0.02em" }}>
              Cardio<span style={{ color: "#60a5fa" }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: 14, color: "rgba(107,123,158,0.9)", lineHeight: 1.65, maxWidth: 300 }}>
            AI-powered cardiovascular risk assessment built on clinically validated data.
            Not a replacement for professional medical advice.
          </p>
          <p
            style={{
              marginTop: 16,
              fontSize: 12,
              color: "rgba(107,123,158,0.6)",
              padding: "10px 14px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8,
              maxWidth: 340,
            }}
          >
            ⚠️ For educational and informational purposes only. Always consult
            a qualified healthcare professional before making medical decisions.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Product
          </h4>
          {["Assessment", "How It Works", "Features"].map((item) => (
            <Link
              key={item}
              href={item === "Assessment" ? "/assessment" : `/#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{
                display: "block",
                fontSize: 14,
                color: "rgba(107,123,158,0.9)",
                textDecoration: "none",
                marginBottom: 10,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a8b4cf")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(107,123,158,0.9)")}
            >
              {item}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff", marginBottom: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            About
          </h4>
          {["Privacy Policy", "Terms of Service", "Contact"].map((item) => (
            <Link
              key={item}
              href="#"
              style={{
                display: "block",
                fontSize: 14,
                color: "rgba(107,123,158,0.9)",
                textDecoration: "none",
                marginBottom: 10,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a8b4cf")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(107,123,158,0.9)")}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p style={{ fontSize: 13, color: "rgba(107,123,158,0.7)" }}>
          © {new Date().getFullYear()} CardioAI. Built for demonstration purposes.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="#" style={{ color: "rgba(107,123,158,0.7)", transition: "color 0.2s" }}>
            <ExternalLink size={17} />
          </Link>
          <Link href="#" style={{ color: "rgba(107,123,158,0.7)", transition: "color 0.2s" }}>
            <Share2 size={17} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
