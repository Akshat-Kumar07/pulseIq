"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { step2Schema, type Step2Data } from "@/features/assessment/schema";
import { useAssessmentStore } from "@/features/assessment/store";

function Field({
  id,
  label,
  hint,
  unit,
  min,
  max,
  error,
  registerProps,
  normalRange,
}: {
  id: string;
  label: string;
  hint: string;
  unit: string;
  min: number;
  max: number;
  error?: string;
  registerProps: object;
  normalRange: string;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <label
        htmlFor={id}
        style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 6, display: "block" }}
      >
        {label}
      </label>
      <p style={{ fontSize: 13, color: "#6b7b9e", marginBottom: 12 }}>{hint}</p>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          {...registerProps}
          style={{
            width: "100%",
            background: "rgba(13,20,36,0.8)",
            border: error ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(26,37,64,0.9)",
            borderRadius: 10,
            color: "#f0f4ff",
            fontSize: 18,
            padding: "13px 70px 13px 18px",
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box" as const,
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#F2545B";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(242, 84, 91, 0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.6)" : "rgba(26,37,64,0.9)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <span
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 13,
            fontWeight: 600,
            color: "#6b7b9e",
            pointerEvents: "none",
          }}
        >
          {unit}
        </span>
      </div>
      <p style={{ fontSize: 12, color: "rgba(107,123,158,0.7)", marginTop: 6 }}>
        Normal range: {normalRange}
      </p>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 13, color: "#ef4444", marginTop: 6 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export default function Step2Vitals() {
  const { formData, updateFormData, setStep } = useAssessmentStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      restingBP: formData.resting_bp,
      cholesterol: formData.cholesterol,
      maxHR: formData.max_hr,
    },
  });

  const onSubmit = (data: Step2Data) => {
    updateFormData({
      resting_bp: data.restingBP,
      cholesterol: data.cholesterol,
      max_hr: data.maxHR,
    });
    setStep(3);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ maxWidth: 520 }}>
        <Field
          id="restingBP"
          label="Resting Blood Pressure"
          hint="Your systolic blood pressure measured at rest."
          unit="mmHg"
          min={60}
          max={250}
          normalRange="90–120 mmHg"
          error={errors.restingBP?.message}
          registerProps={register("restingBP", { valueAsNumber: true })}
        />
        <Field
          id="cholesterol"
          label="Serum Cholesterol"
          hint="Total cholesterol level from your most recent blood test."
          unit="mg/dL"
          min={100}
          max={600}
          normalRange="<200 mg/dL"
          error={errors.cholesterol?.message}
          registerProps={register("cholesterol", { valueAsNumber: true })}
        />
        <Field
          id="maxHR"
          label="Maximum Heart Rate Achieved"
          hint="Highest heart rate recorded during an exercise stress test."
          unit="bpm"
          min={60}
          max={220}
          normalRange="150–185 bpm (exercise peak)"
          error={errors.maxHR?.message}
          registerProps={register("maxHR", { valueAsNumber: true })}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingTop: 8 }}
        >
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #F2545B, #DCEDFF)",
              border: "none",
              color: "#080b14",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(242, 84, 91, 0.4)",
            }}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </form>
  );
}
