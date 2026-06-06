import { z } from "zod";

export const step1Schema = z.object({
  age: z
    .number({ required_error: "Age is required" })
    .int()
    .min(18, "Must be at least 18 years old")
    .max(120, "Please enter a valid age"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
});

export const step2Schema = z.object({
  restingBP: z
    .number({ required_error: "Resting blood pressure is required" })
    .min(60, "Minimum value is 60 mmHg")
    .max(250, "Maximum value is 250 mmHg"),
  cholesterol: z
    .number({ required_error: "Cholesterol level is required" })
    .min(100, "Minimum value is 100 mg/dL")
    .max(600, "Maximum value is 600 mg/dL"),
  maxHeartRate: z
    .number({ required_error: "Maximum heart rate is required" })
    .min(60, "Minimum value is 60 bpm")
    .max(220, "Maximum value is 220 bpm"),
});

export const step3Schema = z.object({
  chestPainType: z.enum(["typical", "atypical", "non-anginal", "asymptomatic"], {
    required_error: "Please select a chest pain type",
  }),
  fastingBloodSugar: z.boolean({
    required_error: "Please indicate fasting blood sugar level",
  }),
  restingECG: z.enum(["normal", "st-t-abnormality", "lv-hypertrophy"], {
    required_error: "Please select your resting ECG result",
  }),
  exerciseAngina: z.boolean({
    required_error: "Please indicate if you experience exercise-induced angina",
  }),
  stDepression: z
    .number({ required_error: "ST depression value is required" })
    .min(0, "Minimum value is 0")
    .max(10, "Maximum value is 10"),
  slope: z.enum(["upsloping", "flat", "downsloping"], {
    required_error: "Please select the slope type",
  }),
  majorVessels: z
    .number({ required_error: "Number of major vessels is required" })
    .int()
    .min(0)
    .max(3),
  thalassemia: z.enum(["normal", "fixed-defect", "reversible-defect"], {
    required_error: "Please select a thalassemia type",
  }),
});

export const assessmentSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type AssessmentData = z.infer<typeof assessmentSchema>;
