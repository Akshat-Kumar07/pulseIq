export type AssessmentStep = 1 | 2 | 3 | 4;

// Matches the HF model schema exactly
export interface AssessmentFormData {
  // Step 1 — Personal
  age: number;
  sex: "M" | "F";
  // Step 2 — Vitals
  resting_bp: number;
  cholesterol: number;
  max_hr: number;
  // Step 3 — Medical Indicators
  fasting_bs: 0 | 1;
  oldpeak: number;
  chest_pain_type: "ASY" | "ATA" | "NAP" | "TA";
  resting_ecg: "LVH" | "Normal" | "ST";
  exercise_angina: "Y" | "N";
  st_slope: "Down" | "Flat" | "Up";
}
