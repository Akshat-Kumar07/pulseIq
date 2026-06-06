export type RiskCategory = "low" | "moderate" | "high";

// ─── HF API raw response ──────────────────────────────────────────────────────

export interface HFAPIResponse {
  prediction: 0 | 1;
  label: string;
  probability_heart_disease: number;
  probability_no_heart_disease: number;
}

// ─── Prediction result returned to the frontend ───────────────────────────────

export interface PredictionResult {
  riskScore: number;        // 0–100 derived from probability
  riskCategory: RiskCategory;
  confidence: number;       // 0–100 certainty of prediction
  probability: {
    heartDisease: number;   // raw 0–1 from HF API
    noHeartDisease: number;
  };
  prediction: 0 | 1;       // raw model prediction
  label: string;            // "Heart Disease Detected" | "No Heart Disease Detected"
  timestamp: string;
}

// ─── Request to /api/predict — mirrors the HF model's expected fields ─────────

export interface PredictRequest {
  // Continuous
  age: number;
  resting_bp: number;
  cholesterol: number;
  fasting_bs: 0 | 1;
  max_hr: number;
  oldpeak: number;
  // Categorical (raw strings — mapped to model values)
  sex: "M" | "F";
  chest_pain_type: "ASY" | "ATA" | "NAP" | "TA";
  resting_ecg: "LVH" | "Normal" | "ST";
  exercise_angina: "Y" | "N";
  st_slope: "Down" | "Flat" | "Up";
}
