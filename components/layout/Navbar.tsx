"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/assessment", label: "Assessment" },
  { href: "/#about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          background: scrolled
            ? "rgba(8, 11, 20, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <nav
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(59,130,246,0.4)",
              }}
            >
              <Activity size={18} color="white" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#f0f4ff",
                letterSpacing: "-0.02em",
              }}
            >
              Cardio<span style={{ color: "#60a5fa" }}>AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color:
                    pathname === link.href
                      ? "#60a5fa"
                      : "rgba(168, 180, 207, 0.9)",
                  textDecoration: "none",
                  transition: "color 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#f0f4ff";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    pathname === link.href
                      ? "#60a5fa"
                      : "rgba(168, 180, 207, 0.9)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/assessment"
              style={{
                marginLeft: 8,
                padding: "8px 20px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Start Assessment
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "#f0f4ff",
              cursor: "pointer",
              padding: 8,
            }}
            className="mobile-menu-btn"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(8, 11, 20, 0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 24px 24px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "rgba(168, 180, 207, 0.9)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/assessment"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                marginTop: 16,
                padding: "12px 24px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Start Assessment
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
