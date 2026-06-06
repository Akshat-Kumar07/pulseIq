export type Gender = "male" | "female";
export type ChestPainType = "typical" | "atypical" | "non-anginal" | "asymptomatic";
export type RestingECG = "normal" | "st-t-abnormality" | "lv-hypertrophy";
export type SlopeType = "upsloping" | "flat" | "downsloping";
export type ThalassemiaType = "normal" | "fixed-defect" | "reversible-defect";

export interface AssessmentFormData {
  // Step 1
  age: number;
  gender: Gender;
  // Step 2
  restingBP: number;
  cholesterol: number;
  maxHeartRate: number;
  // Step 3
  chestPainType: ChestPainType;
  fastingBloodSugar: boolean;
  restingECG: RestingECG;
  exerciseAngina: boolean;
  stDepression: number;
  slope: SlopeType;
  majorVessels: number;
  thalassemia: ThalassemiaType;
}

export type AssessmentStep = 1 | 2 | 3 | 4;
