import type { PredictRequest, PredictionResult, RiskCategory } from "./types";

const HF_BASE_URL = "https://akshatkumar1001-pulseiq.hf.space";

function deriveRiskScore(probability: number): number {
  return Math.round(Math.pow(probability, 0.85) * 100);
}

function deriveCategory(score: number): RiskCategory {
  if (score >= 60) return "high";
  if (score >= 35) return "moderate";
  return "low";
}

export async function callPredictAPI(
  data: PredictRequest
): Promise<PredictionResult> {
  const response = await fetch(`${HF_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(`HuggingFace API error ${response.status}: ${errorBody}`);
  }

  const hf = await response.json();

  const riskScore = deriveRiskScore(hf.probability_heart_disease);
  const riskCategory = deriveCategory(riskScore);
  const rawConfidence = Math.abs(hf.probability_heart_disease - 0.5) * 2;
  const confidence = Math.round(70 + rawConfidence * 29);

  return {
    riskScore,
    riskCategory,
    confidence,
    probability: {
      heartDisease: hf.probability_heart_disease,
      noHeartDisease: hf.probability_no_heart_disease,
    },
    prediction: hf.prediction,
    label: hf.label,
    timestamp: new Date().toISOString(),
  };
}
