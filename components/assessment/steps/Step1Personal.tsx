"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { step1Schema, type Step1Data } from "@/features/assessment/schema";
import { useAssessmentStore } from "@/features/assessment/store";

export default function Step1Personal() {
  const { formData, updateFormData, setStep } = useAssessmentStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      age: formData.age,
      gender: formData.sex,
    },
  });

  const selectedGender = watch("gender");

  const onSubmit = (data: Step1Data) => {
    updateFormData({ age: data.age, sex: data.gender });
    setStep(2);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(13,20,36,0.8)",
    border: "1px solid rgba(26,37,64,0.9)",
    borderRadius: 10,
    color: "#f0f4ff",
    fontSize: 18,
    padding: "13px 18px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ maxWidth: 520 }}>
        {/* Age */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ marginBottom: 32 }}
        >
          <label
            htmlFor="age"
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#f0f4ff",
              marginBottom: 6,
              display: "block",
            }}
          >
            Age
          </label>
          <p style={{ fontSize: 13, color: "#6b7b9e", marginBottom: 12 }}>
            Your current age in years.
          </p>
          <div style={{ position: "relative" }}>
            <input
              id="age"
              type="number"
              min={18}
              max={120}
              {...register("age", { valueAsNumber: true })}
              style={{ ...inputStyle, paddingRight: 64 }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(59,130,246,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  errors.age ? "rgba(239,68,68,0.6)" : "rgba(26,37,64,0.9)";
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
              years
            </span>
          </div>
          {errors.age && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 13, color: "#ef4444", marginTop: 8 }}
            >
              {errors.age.message}
            </motion.p>
          )}
        </motion.div>

        {/* Biological Sex */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 40 }}
        >
          <label
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#f0f4ff",
              marginBottom: 6,
              display: "block",
            }}
          >
            Biological Sex
          </label>
          <p style={{ fontSize: 13, color: "#6b7b9e", marginBottom: 12 }}>
            Sex assigned at birth, used as a clinical risk factor.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {(["M", "F"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setValue("gender", val)}
                style={{
                  padding: "18px",
                  borderRadius: 12,
                  border:
                    selectedGender === val
                      ? "2px solid #3b82f6"
                      : "1px solid rgba(26,37,64,0.9)",
                  background:
                    selectedGender === val
                      ? "rgba(59,130,246,0.08)"
                      : "rgba(13,20,36,0.5)",
                  color: selectedGender === val ? "#60a5fa" : "#a8b4cf",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {val === "M" ? "Male (M)" : "Female (F)"}
              </button>
            ))}
          </div>
          {errors.gender && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 13, color: "#ef4444", marginTop: 8 }}
            >
              {errors.gender.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              border: "none",
              color: "white",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(59,130,246,0.4)",
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
