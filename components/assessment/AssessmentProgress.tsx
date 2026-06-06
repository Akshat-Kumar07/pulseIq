"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  step: number;
  label: string;
  description: string;
}

interface AssessmentProgressProps {
  currentStep: number;
  steps: Step[];
}

export default function AssessmentProgress({ currentStep, steps }: AssessmentProgressProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: 0,
      }}
    >
      {steps.map((item, i) => {
        const isDone = currentStep > item.step;
        const isActive = currentStep === item.step;

        return (
          <div
            key={item.step}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < steps.length - 1 ? 1 : "none",
            }}
          >
            {/* Step indicator */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  paddingBottom: 16,
                  borderBottom: isActive
                    ? "2px solid #F2545B"
                    : isDone
                    ? "2px solid #10b98160"
                    : "2px solid transparent",
                  paddingRight: i < steps.length - 1 ? 0 : 0,
                }}
              >
                {/* Circle — gradient set via style, only borderColor animated */}
                <motion.div
                  animate={{
                    borderColor: isDone
                      ? "#10b981"
                      : isActive
                      ? "#F2545B"
                      : "rgba(255,255,255,0.08)",
                    opacity: 1,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1.5px solid",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: isDone
                      ? "#10b981"
                      : isActive
                      ? "linear-gradient(135deg, #F2545B, #DCEDFF)"
                      : "rgba(26,37,64,0.8)",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(242, 84, 91, 0.2)"
                      : "none",
                    transition: "background 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  {isDone ? (
                    <Check size={13} color="white" strokeWidth={3} />
                  ) : (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: isActive ? "white" : "#6b7b9e",
                      }}
                    >
                      {item.step}
                    </span>
                  )}
                </motion.div>

                {/* Label */}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#f0f4ff" : isDone ? "#10b981" : "#6b7b9e",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  margin: "0 12px",
                  marginBottom: 16,
                  background: isDone
                    ? "rgba(16,185,129,0.3)"
                    : "rgba(255,255,255,0.06)",
                  transition: "background 0.4s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
