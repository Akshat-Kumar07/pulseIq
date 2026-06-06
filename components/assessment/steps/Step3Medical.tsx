"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { step3Schema, type Step3Data } from "@/features/assessment/schema";
import { useAssessmentStore } from "@/features/assessment/store";

function RadioCards<T extends string>({
  options,
  value,
  onChange,
  error,
}: {
  options: { value: T; label: string; description: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
  error?: string;
}) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: options.length > 2 ? "1fr 1fr" : "1fr 1fr",
          gap: 10,
        }}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              border: value === opt.value ? "2px solid #3b82f6" : "1px solid rgba(26,37,64,0.9)",
              background: value === opt.value ? "rgba(59,130,246,0.1)" : "rgba(13,20,36,0.5)",
              color: value === opt.value ? "#60a5fa" : "#a8b4cf",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{opt.label}</div>
            <div style={{ fontSize: 12, color: value === opt.value ? "#93c5fd" : "#6b7b9e", lineHeight: 1.4 }}>
              {opt.description}
            </div>
          </button>
        ))}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 13, color: "#ef4444", marginTop: 8 }}>
          {error}
        </motion.p>
      )}
    </div>
  );
}

function YNToggle({ value, onChange }: { value: "Y" | "N" | undefined; onChange: (v: "Y" | "N") => void }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {(["Y", "N"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          style={{
            flex: 1,
            padding: "13px",
            borderRadius: 10,
            border: value === v
              ? `2px solid ${v === "Y" ? "#ef4444" : "#10b981"}`
              : "1px solid rgba(26,37,64,0.9)",
            background: value === v
              ? v === "Y" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)"
              : "rgba(13,20,36,0.5)",
            color: value === v ? (v === "Y" ? "#ef4444" : "#10b981") : "#a8b4cf",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {v === "Y" ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}

const fieldStyle = { marginBottom: 32 };
const labelStyle: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 6, display: "block" };
const hintStyle: React.CSSProperties = { fontSize: 13, color: "#6b7b9e", marginBottom: 12 };

export default function Step3Medical() {
  const { formData, updateFormData, setStep } = useAssessmentStore();

  const { control, register, handleSubmit, formState: { errors } } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      fastingBS: formData.fasting_bs !== undefined ? Boolean(formData.fasting_bs) : undefined,
      oldpeak: formData.oldpeak,
      chestPainType: formData.chest_pain_type,
      restingECG: formData.resting_ecg,
      exerciseAngina: formData.exercise_angina,
      stSlope: formData.st_slope,
    },
  });

  const onSubmit = (data: Step3Data) => {
    updateFormData({
      fasting_bs: data.fastingBS ? 1 : 0,
      oldpeak: data.oldpeak,
      chest_pain_type: data.chestPainType,
      resting_ecg: data.restingECG,
      exercise_angina: data.exerciseAngina,
      st_slope: data.stSlope,
    });
    setStep(4);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ maxWidth: 620 }}>

        {/* Chest Pain Type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={fieldStyle}>
          <label style={labelStyle}>Chest Pain Type</label>
          <p style={hintStyle}>The type of chest discomfort you typically experience.</p>
          <Controller name="chestPainType" control={control} render={({ field }) => (
            <RadioCards
              value={field.value}
              onChange={field.onChange}
              error={errors.chestPainType?.message}
              options={[
                { value: "ASY", label: "ASY — Asymptomatic", description: "No chest pain or discomfort" },
                { value: "ATA", label: "ATA — Atypical Angina", description: "Unusual chest pain characteristics" },
                { value: "NAP", label: "NAP — Non-Anginal Pain", description: "Chest pain unrelated to cardiac causes" },
                { value: "TA", label: "TA — Typical Angina", description: "Classic exertional chest pain, relieved by rest" },
              ]}
            />
          )} />
        </motion.div>

        {/* Fasting Blood Sugar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={fieldStyle}>
          <label style={labelStyle}>Fasting Blood Sugar &gt; 120 mg/dL</label>
          <p style={hintStyle}>Is your fasting blood glucose above 120 mg/dL? (FastingBS = 1 if yes)</p>
          <Controller name="fastingBS" control={control} render={({ field }) => (
            <div style={{ display: "flex", gap: 10 }}>
              {([true, false] as const).map((v) => (
                <button key={String(v)} type="button" onClick={() => field.onChange(v)}
                  style={{
                    flex: 1, padding: "13px", borderRadius: 10,
                    border: field.value === v ? `2px solid ${v ? "#ef4444" : "#10b981"}` : "1px solid rgba(26,37,64,0.9)",
                    background: field.value === v ? (v ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)") : "rgba(13,20,36,0.5)",
                    color: field.value === v ? (v ? "#ef4444" : "#10b981") : "#a8b4cf",
                    fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease",
                  }}
                >
                  {v ? "Yes (FastingBS = 1)" : "No (FastingBS = 0)"}
                </button>
              ))}
            </div>
          )} />
        </motion.div>

        {/* Resting ECG */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={fieldStyle}>
          <label style={labelStyle}>Resting ECG</label>
          <p style={hintStyle}>Result of your resting electrocardiogram.</p>
          <Controller name="restingECG" control={control} render={({ field }) => (
            <RadioCards
              value={field.value}
              onChange={field.onChange}
              error={errors.restingECG?.message}
              options={[
                { value: "Normal", label: "Normal", description: "No significant abnormalities" },
                { value: "ST", label: "ST Abnormality", description: "ST-T wave changes or T-wave inversions" },
                { value: "LVH", label: "LVH", description: "Left ventricular hypertrophy by Estes criteria" },
              ]}
            />
          )} />
        </motion.div>

        {/* Exercise Angina */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={fieldStyle}>
          <label style={labelStyle}>Exercise-Induced Angina (ExerciseAngina)</label>
          <p style={hintStyle}>Do you experience chest pain or pressure during physical exertion?</p>
          <Controller name="exerciseAngina" control={control} render={({ field }) => (
            <YNToggle value={field.value} onChange={field.onChange} />
          )} />
          {errors.exerciseAngina && (
            <p style={{ fontSize: 13, color: "#ef4444", marginTop: 8 }}>{errors.exerciseAngina.message}</p>
          )}
        </motion.div>

        {/* Oldpeak / ST Depression */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={fieldStyle}>
          <label htmlFor="oldpeak" style={labelStyle}>Oldpeak (ST Depression)</label>
          <p style={hintStyle}>ST depression induced by exercise relative to rest. Typically 0–6.</p>
          <div style={{ position: "relative" }}>
            <input
              id="oldpeak"
              type="number"
              min={0}
              max={10}
              step={0.1}
              {...register("oldpeak", { valueAsNumber: true })}
              style={{
                width: "100%", background: "rgba(13,20,36,0.8)",
                border: errors.oldpeak ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(26,37,64,0.9)",
                borderRadius: 10, color: "#f0f4ff", fontSize: 18,
                padding: "13px 18px", outline: "none", fontFamily: "inherit",
                boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.oldpeak ? "rgba(239,68,68,0.6)" : "rgba(26,37,64,0.9)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
          {errors.oldpeak && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 13, color: "#ef4444", marginTop: 6 }}>
              {errors.oldpeak.message}
            </motion.p>
          )}
        </motion.div>

        {/* ST Slope */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={fieldStyle}>
          <label style={labelStyle}>Peak Exercise ST Slope (ST_Slope)</label>
          <p style={hintStyle}>The slope of the peak exercise ST segment on your ECG.</p>
          <Controller name="stSlope" control={control} render={({ field }) => (
            <RadioCards
              value={field.value}
              onChange={field.onChange}
              error={errors.stSlope?.message}
              options={[
                { value: "Up", label: "Up — Upsloping", description: "ST rises with exercise (less concerning)" },
                { value: "Flat", label: "Flat", description: "ST remains level (moderate concern)" },
                { value: "Down", label: "Down — Downsloping", description: "ST falls with exercise (most concerning)" },
              ]}
            />
          )} />
        </motion.div>

        {/* Navigation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingTop: 8 }}>
          <button type="submit"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px",
              borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #6366f1)", border: "none",
              color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 6px 24px rgba(59,130,246,0.4)",
            }}>
            Review Summary<ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </form>
  );
}
