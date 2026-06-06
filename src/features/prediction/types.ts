export type RiskCategory = "low" | "moderate" | "high";

export interface RiskFactor {
  name: string;
  value: string | number;
  impact: "positive" | "negative" | "neutral";
  weight: number; // 0-100
  description: string;
}

export interface HealthMetric {
  name: string;
  userValue: number;
  healthyMin: number;
  healthyMax: number;
  unit: string;
}

export interface AIInsight {
  category: "lifestyle" | "exercise" | "nutrition" | "medical";
  title: string;
  recommendations: string[];
  priority: "high" | "medium" | "low";
}

export interface PredictionResult {
  riskScore: number; // 0-100
  riskCategory: RiskCategory;
  confidence: number; // 0-100
  factors: RiskFactor[];
  metrics: HealthMetric[];
  insights: AIInsight[];
  timestamp: string;
}

export interface PredictRequest {
  age: number;
  gender: string;
  restingBP: number;
  cholesterol: number;
  maxHeartRate: number;
  chestPainType: string;
  fastingBloodSugar: boolean;
  restingECG: string;
  exerciseAngina: boolean;
  stDepression: number;
  slope: string;
  majorVessels: number;
  thalassemia: string;
}
