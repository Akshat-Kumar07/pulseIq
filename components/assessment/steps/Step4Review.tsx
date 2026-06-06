"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAssessmentStore } from "@/features/assessment/store";

function Row({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <span style={{ fontSize: 14, color: "#6b7b9e" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>{value ?? "—"}</span>
    </div>
  );
}

export default function Step4Review() {
  const { formData, setStep, setSubmitting, isSubmitting } = useAssessmentStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    // Build the exact payload the HF API expects
    const payload = {
      age: formData.age,
      resting_bp: formData.resting_bp,
      cholesterol: formData.cholesterol,
      fasting_bs: formData.fasting_bs,
      max_hr: formData.max_hr,
      oldpeak: formData.oldpeak,
      sex: formData.sex,
      chest_pain_type: formData.chest_pain_type,
      resting_ecg: formData.resting_ecg,
      exercise_angina: formData.exercise_angina,
      st_slope: formData.st_slope,
    };

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process assessment");
      }

      const result = await res.json();
      sessionStorage.setItem("cardioai_result", JSON.stringify(result));
      sessionStorage.setItem("cardioai_formData", JSON.stringify(formData));

      toast.success("Assessment complete — viewing your results");
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      toast.error("Failed to process assessment. Please try again.");
      setSubmitting(false);
    }
  };

  const cpLabels: Record<string, string> = {
    ASY: "Asymptomatic (ASY)",
    ATA: "Atypical Angina (ATA)",
    NAP: "Non-Anginal Pain (NAP)",
    TA: "Typical Angina (TA)",
  };
  const ecgLabels: Record<string, string> = {
    Normal: "Normal",
    ST: "ST Abnormality",
    LVH: "Left Ventricular Hypertrophy",
  };
  const slopeLabels: Record<string, string> = {
    Up: "Upsloping",
    Flat: "Flat",
    Down: "Downsloping",
  };

  const sections = [
    {
      title: "Step 1 — Personal",
      step: 1 as const,
      rows: [
        { label: "Age", value: formData.age ? `${formData.age} years` : undefined },
        { label: "Sex", value: formData.sex === "M" ? "Male (M)" : formData.sex === "F" ? "Female (F)" : undefined },
      ],
    },
    {
      title: "Step 2 — Vital Statistics",
      step: 2 as const,
      rows: [
        { label: "Resting BP", value: formData.resting_bp ? `${formData.resting_bp} mmHg` : undefined },
        { label: "Cholesterol", value: formData.cholesterol ? `${formData.cholesterol} mg/dL` : undefined },
        { label: "Max Heart Rate", value: formData.max_hr ? `${formData.max_hr} bpm` : undefined },
      ],
    },
    {
      title: "Step 3 — Medical Indicators",
      step: 3 as const,
      rows: [
        { label: "Chest Pain Type", value: formData.chest_pain_type ? cpLabels[formData.chest_pain_type] : undefined },
        { label: "Fasting Blood Sugar > 120", value: formData.fasting_bs !== undefined ? (formData.fasting_bs ? "Yes (1)" : "No (0)") : undefined },
        { label: "Resting ECG", value: formData.resting_ecg ? ecgLabels[formData.resting_ecg] : undefined },
        { label: "Exercise Angina", value: formData.exercise_angina === "Y" ? "Yes" : formData.exercise_angina === "N" ? "No" : undefined },
        { label: "Oldpeak (ST Depression)", value: formData.oldpeak !== undefined ? String(formData.oldpeak) : undefined },
        { label: "ST Slope", value: formData.st_slope ? slopeLabels[formData.st_slope] : undefined },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: 620 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Info banner */}
        <div style={{
          background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 12, padding: "16px 20px", marginBottom: 28,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <CheckCircle size={20} color="#60a5fa" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", marginBottom: 4 }}>Review your information</p>
            <p style={{ fontSize: 13, color: "#6b7b9e", lineHeight: 1.5 }}>
              Verify your inputs before submitting to the model. These are sent directly to the prediction API.
            </p>
          </div>
        </div>

        {/* Section cards */}
        {sections.map((section) => (
          <div key={section.title} style={{
            background: "rgba(13,20,36,0.7)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: "20px 24px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff" }}>{section.title}</h3>
              <button type="button" onClick={() => setStep(section.step)}
                style={{
                  fontSize: 13, color: "#60a5fa", background: "none", border: "none",
                  cursor: "pointer", padding: "2px 8px", borderRadius: 6, transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >Edit</button>
            </div>
            {section.rows.map((r) => <Row key={r.label} label={r.label} value={r.value} />)}
          </div>
        ))}

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 10, padding: "14px 18px", display: "flex",
              alignItems: "center", gap: 10, marginBottom: 20,
            }}>
            <AlertCircle size={16} color="#ef4444" />
            <p style={{ fontSize: 14, color: "#fca5a5" }}>{error}</p>
          </motion.div>
        )}

        {/* Nav buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 24 }}>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px",
              borderRadius: 12,
              background: isSubmitting ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
              border: "none", color: "white", fontSize: 15, fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: isSubmitting ? "none" : "0 6px 24px rgba(59,130,246,0.4)",
              transition: "opacity 0.2s",
            }}>
            {isSubmitting ? (<><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Analyzing...</>) : "Submit Assessment"}
          </button>
        </div>
      </motion.div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
