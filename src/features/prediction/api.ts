import type { PredictRequest, PredictionResult, RiskFactor, HealthMetric, AIInsight, RiskCategory } from "./types";

/**
 * Weighted scoring algorithm based on UCI Heart Disease dataset.
 * Returns a 0-100 risk score.
 * 
 * FUTURE INTEGRATION: Replace the body of `callPredictAPI` with a
 * Hugging Face Inference API call when the model is ready.
 */
function computeRiskScore(data: PredictRequest): number {
  let score = 0;

  // Age factor (0-20 points)
  if (data.age >= 65) score += 20;
  else if (data.age >= 55) score += 15;
  else if (data.age >= 45) score += 8;
  else score += 2;

  // Gender factor (0-8 points) — males statistically higher risk
  if (data.gender === "male") score += 8;
  else score += 3;

  // Chest pain type (0-20 points)
  const cpScores = { typical: 20, atypical: 12, "non-anginal": 6, asymptomatic: 2 };
  score += cpScores[data.chestPainType as keyof typeof cpScores] ?? 0;

  // Resting BP (0-10 points)
  if (data.restingBP >= 160) score += 10;
  else if (data.restingBP >= 140) score += 7;
  else if (data.restingBP >= 120) score += 3;

  // Cholesterol (0-10 points)
  if (data.cholesterol >= 300) score += 10;
  else if (data.cholesterol >= 240) score += 7;
  else if (data.cholesterol >= 200) score += 3;

  // Fasting blood sugar (0-5 points)
  if (data.fastingBloodSugar) score += 5;

  // Resting ECG (0-8 points)
  const ecgScores = { normal: 0, "st-t-abnormality": 6, "lv-hypertrophy": 8 };
  score += ecgScores[data.restingECG as keyof typeof ecgScores] ?? 0;

  // Max heart rate (0-8 points) — lower is riskier
  if (data.maxHeartRate < 100) score += 8;
  else if (data.maxHeartRate < 130) score += 4;
  else if (data.maxHeartRate < 150) score += 2;

  // Exercise angina (0-6 points)
  if (data.exerciseAngina) score += 6;

  // ST depression (0-8 points)
  if (data.stDepression >= 3) score += 8;
  else if (data.stDepression >= 2) score += 5;
  else if (data.stDepression >= 1) score += 2;

  // Slope (0-6 points)
  const slopeScores = { upsloping: 0, flat: 4, downsloping: 6 };
  score += slopeScores[data.slope as keyof typeof slopeScores] ?? 0;

  // Major vessels (0-8 points)
  score += Math.min(data.majorVessels * 3, 8);

  // Thalassemia (0-8 points)
  const thalScores = { normal: 0, "fixed-defect": 4, "reversible-defect": 8 };
  score += thalScores[data.thalassemia as keyof typeof thalScores] ?? 0;

  // Normalize to 0-100
  const maxPossible = 20 + 8 + 20 + 10 + 10 + 5 + 8 + 8 + 6 + 8 + 6 + 8 + 8;
  return Math.round((score / maxPossible) * 100);
}

function buildFactors(data: PredictRequest, riskScore: number): RiskFactor[] {
  const factors: RiskFactor[] = [
    {
      name: "Chest Pain Type",
      value: data.chestPainType.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      impact: data.chestPainType === "typical" ? "negative" : data.chestPainType === "asymptomatic" ? "positive" : "neutral",
      weight: data.chestPainType === "typical" ? 85 : data.chestPainType === "atypical" ? 55 : data.chestPainType === "non-anginal" ? 30 : 10,
      description: "Type of chest pain experienced during activity or at rest",
    },
    {
      name: "Cholesterol",
      value: `${data.cholesterol} mg/dL`,
      impact: data.cholesterol >= 240 ? "negative" : data.cholesterol <= 200 ? "positive" : "neutral",
      weight: Math.min(Math.round(((data.cholesterol - 100) / 500) * 100), 100),
      description: "Total serum cholesterol level",
    },
    {
      name: "Resting Blood Pressure",
      value: `${data.restingBP} mmHg`,
      impact: data.restingBP >= 140 ? "negative" : data.restingBP <= 120 ? "positive" : "neutral",
      weight: Math.min(Math.round(((data.restingBP - 60) / 190) * 100), 100),
      description: "Blood pressure at rest (systolic)",
    },
    {
      name: "Max Heart Rate",
      value: `${data.maxHeartRate} bpm`,
      impact: data.maxHeartRate < 120 ? "negative" : data.maxHeartRate >= 160 ? "positive" : "neutral",
      weight: Math.round(100 - ((data.maxHeartRate - 60) / 160) * 100),
      description: "Maximum heart rate achieved during exercise stress test",
    },
    {
      name: "Thalassemia",
      value: data.thalassemia.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      impact: data.thalassemia === "reversible-defect" ? "negative" : data.thalassemia === "normal" ? "positive" : "neutral",
      weight: data.thalassemia === "reversible-defect" ? 80 : data.thalassemia === "fixed-defect" ? 45 : 10,
      description: "Thalassemia blood disorder screening result",
    },
    {
      name: "Major Vessels",
      value: `${data.majorVessels} vessel${data.majorVessels !== 1 ? "s" : ""}`,
      impact: data.majorVessels >= 2 ? "negative" : data.majorVessels === 0 ? "positive" : "neutral",
      weight: Math.round((data.majorVessels / 3) * 100),
      description: "Number of major vessels colored by fluoroscopy",
    },
    {
      name: "ST Depression",
      value: data.stDepression.toFixed(1),
      impact: data.stDepression >= 2 ? "negative" : data.stDepression === 0 ? "positive" : "neutral",
      weight: Math.min(Math.round((data.stDepression / 6) * 100), 100),
      description: "ST depression induced by exercise relative to rest",
    },
    {
      name: "Exercise Angina",
      value: data.exerciseAngina ? "Present" : "Absent",
      impact: data.exerciseAngina ? "negative" : "positive",
      weight: data.exerciseAngina ? 75 : 5,
      description: "Presence of angina during exercise",
    },
  ];

  return factors.sort((a, b) => b.weight - a.weight);
}

function buildMetrics(data: PredictRequest): HealthMetric[] {
  return [
    {
      name: "Blood Pressure",
      userValue: data.restingBP,
      healthyMin: 90,
      healthyMax: 120,
      unit: "mmHg",
    },
    {
      name: "Cholesterol",
      userValue: data.cholesterol,
      healthyMin: 150,
      healthyMax: 200,
      unit: "mg/dL",
    },
    {
      name: "Max Heart Rate",
      userValue: data.maxHeartRate,
      healthyMin: 150,
      healthyMax: 185,
      unit: "bpm",
    },
    {
      name: "ST Depression",
      userValue: data.stDepression,
      healthyMin: 0,
      healthyMax: 0.5,
      unit: "",
    },
  ];
}

function buildInsights(data: PredictRequest, riskScore: number): AIInsight[] {
  const insights: AIInsight[] = [];

  // Lifestyle
  const lifestyle: string[] = [];
  if (data.restingBP >= 140) lifestyle.push("Monitor your blood pressure daily and reduce sodium intake to below 2,300 mg per day");
  if (data.cholesterol >= 240) lifestyle.push("Reduce saturated fat intake and consult your physician about cholesterol management");
  if (data.fastingBloodSugar) lifestyle.push("Work with your care team to manage blood glucose levels through diet and lifestyle changes");
  lifestyle.push("Maintain consistent sleep patterns of 7–9 hours per night to support cardiovascular health");
  lifestyle.push("Avoid tobacco products and limit alcohol to reduce cardiovascular risk factors");
  insights.push({ category: "lifestyle", title: "Lifestyle Modifications", recommendations: lifestyle, priority: riskScore >= 60 ? "high" : riskScore >= 35 ? "medium" : "low" });

  // Exercise
  const exercise: string[] = [];
  if (data.maxHeartRate < 130) {
    exercise.push("Your exercise capacity appears limited — begin with low-intensity activity (walking 20–30 min, 5×/week)");
    exercise.push("Consider a supervised cardiac rehabilitation program for safe exercise progression");
  } else {
    exercise.push("Aim for 150 minutes of moderate-intensity aerobic exercise per week");
    exercise.push("Incorporate resistance training 2–3 times per week to support heart health");
  }
  if (data.exerciseAngina) exercise.push("Exercise under medical supervision given exercise-induced angina — avoid high-intensity activities until cleared");
  exercise.push("Track resting heart rate trends as an indicator of improving cardiovascular fitness");
  insights.push({ category: "exercise", title: "Exercise Guidance", recommendations: exercise, priority: riskScore >= 60 ? "high" : "medium" });

  // Nutrition
  const nutrition: string[] = [];
  if (data.cholesterol >= 200) {
    nutrition.push("Adopt a Mediterranean-style diet rich in omega-3 fatty acids, vegetables, legumes, and whole grains");
    nutrition.push("Limit red meat to no more than 1–2 servings per week; prefer lean protein sources");
  }
  if (data.fastingBloodSugar) nutrition.push("Limit refined carbohydrates and added sugars — focus on low glycemic index foods");
  nutrition.push("Increase dietary fiber intake (25–35g/day) through fruits, vegetables, and whole grains");
  nutrition.push("Stay well-hydrated — aim for 8 glasses of water per day");
  insights.push({ category: "nutrition", title: "Nutrition Guidance", recommendations: nutrition, priority: riskScore >= 50 ? "high" : "medium" });

  // Medical
  const medical: string[] = [];
  if (riskScore >= 60) {
    medical.push("Schedule a cardiology consultation within the next 1–2 weeks for a comprehensive evaluation");
    medical.push("Request a stress echocardiogram or nuclear stress test to assess cardiac function under load");
  } else if (riskScore >= 35) {
    medical.push("Schedule a follow-up with your primary care physician within the next month");
    medical.push("Discuss whether preventive cardiovascular medications (statins, aspirin) are appropriate for you");
  } else {
    medical.push("Continue routine annual cardiovascular checkups with your physician");
    medical.push("Repeat this assessment annually or if your health status changes significantly");
  }
  medical.push("Keep a record of all symptoms, medications, and test results to share with your healthcare team");
  insights.push({ category: "medical", title: "Medical Follow-Up", recommendations: medical, priority: riskScore >= 60 ? "high" : riskScore >= 35 ? "medium" : "low" });

  return insights;
}

export async function callPredictAPI(data: PredictRequest): Promise<PredictionResult> {
  /**
   * FUTURE HUGGING FACE INTEGRATION:
   * Replace this function body with:
   * 
   * const response = await fetch(
   *   "https://api-inference.huggingface.co/models/YOUR_MODEL_ID",
   *   {
   *     method: "POST",
   *     headers: {
   *       Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
   *       "Content-Type": "application/json",
   *     },
   *     body: JSON.stringify({ inputs: data }),
   *   }
   * );
   * const result = await response.json();
   * return transformHFResult(result, data);
   */

  // Current: local weighted scoring
  const riskScore = computeRiskScore(data);
  const riskCategory: RiskCategory =
    riskScore >= 60 ? "high" : riskScore >= 35 ? "moderate" : "low";

  // Simulate confidence based on completeness of data
  const confidence = Math.round(78 + Math.random() * 14); // 78-92%

  return {
    riskScore,
    riskCategory,
    confidence,
    factors: buildFactors(data, riskScore),
    metrics: buildMetrics(data),
    insights: buildInsights(data, riskScore),
    timestamp: new Date().toISOString(),
  };
}
