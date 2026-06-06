import { z } from "zod";

export const step1Schema = z.object({
  age: z
    .number({ error: "Age is required" })
    .int()
    .min(18, "Must be at least 18 years old")
    .max(120, "Please enter a valid age"),
  gender: z.enum(["M", "F"], {
    error: "Please select a biological sex",
  }),
});

export const step2Schema = z.object({
  restingBP: z
    .number({ error: "Resting blood pressure is required" })
    .min(60, "Minimum value is 60 mmHg")
    .max(250, "Maximum value is 250 mmHg"),
  cholesterol: z
    .number({ error: "Cholesterol level is required" })
    .min(100, "Minimum value is 100 mg/dL")
    .max(600, "Maximum value is 600 mg/dL"),
  maxHR: z
    .number({ error: "Maximum heart rate is required" })
    .min(60, "Minimum value is 60 bpm")
    .max(220, "Maximum value is 220 bpm"),
});

export const step3Schema = z.object({
  fastingBS: z.boolean({
    error: "Please indicate fasting blood sugar level",
  }),
  oldpeak: z
    .number({ error: "ST depression value is required" })
    .min(0, "Minimum value is 0")
    .max(10, "Maximum value is 10"),
  chestPainType: z.enum(["ASY", "ATA", "NAP", "TA"], {
    error: "Please select a chest pain type",
  }),
  restingECG: z.enum(["LVH", "Normal", "ST"], {
    error: "Please select your resting ECG result",
  }),
  exerciseAngina: z.enum(["Y", "N"], {
    error: "Please indicate if you experience exercise-induced angina",
  }),
  stSlope: z.enum(["Down", "Flat", "Up"], {
    error: "Please select the slope type",
  }),
});

export const assessmentSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type AssessmentData = z.infer<typeof assessmentSchema>;
