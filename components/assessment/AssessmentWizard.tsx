"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { useAssessmentStore } from "@/features/assessment/store";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import { ArrowLeft } from "lucide-react";
import Step1Personal from "@/components/assessment/steps/Step1Personal";
import Step2Vitals from "@/components/assessment/steps/Step2Vitals";
import Step3Medical from "@/components/assessment/steps/Step3Medical";
import Step4Review from "@/components/assessment/steps/Step4Review";

const stepTitles = [
  { step: 1, label: "Personal", description: "Basic information" },
  { step: 2, label: "Vitals", description: "Biometric markers" },
  { step: 3, label: "Clinical", description: "Medical indicators" },
  { step: 4, label: "Review", description: "Confirm & submit" },
];

export default function AssessmentWizard() {
  const { currentStep, setStep } = useAssessmentStore();
  const router = useRouter();

  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1Personal />,
    2: <Step2Vitals />,
    3: <Step3Medical />,
    4: <Step4Review />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <main
        style={{
          paddingTop: 80,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(13,20,36,0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              padding: "28px 32px 0",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ marginBottom: 16 }}>
                {currentStep > 1 ? (
                  <button
                    onClick={() => setStep((currentStep - 1) as any)}
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
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#a8b4cf")}
                  >
                    <ArrowLeft size={14} /> Back to {stepTitles[currentStep - 2]?.label}
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/")}
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
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#a8b4cf")}
                  >
                    <ArrowLeft size={14} /> Back to Home
                  </button>
                )}
              </div>
              <p style={{ fontSize: 12, color: "#6b7b9e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                Cardiovascular Risk Assessment
              </p>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", letterSpacing: "-0.02em", marginBottom: 24 }}>
                {stepTitles[currentStep - 1]?.label} —{" "}
                <span style={{ color: "#a8b4cf", fontWeight: 500 }}>
                  {stepTitles[currentStep - 1]?.description}
                </span>
              </h1>
            </motion.div>

            <AssessmentProgress currentStep={currentStep} steps={stepTitles} />
          </div>
        </div>

        {/* Step content */}
        <div
          style={{
            flex: 1,
            maxWidth: 860,
            margin: "0 auto",
            width: "100%",
            padding: "48px 32px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {stepComponents[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
