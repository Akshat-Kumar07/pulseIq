import { NextRequest, NextResponse } from "next/server";
import { callPredictAPI } from "@/features/prediction/api";
import type { PredictRequest } from "@/features/prediction/types";

const REQUIRED_FIELDS: (keyof PredictRequest)[] = [
  "age", "resting_bp", "cholesterol", "fasting_bs",
  "max_hr", "oldpeak", "sex", "chest_pain_type",
  "resting_ecg", "exercise_angina", "st_slope",
];

export async function POST(request: NextRequest) {
  try {
    const body: PredictRequest = await request.json();

    for (const field of REQUIRED_FIELDS) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    console.log("[/api/predict] Request payload:", JSON.stringify(body, null, 2));

    const result = await callPredictAPI(body);

    console.log("[/api/predict] HF API response:", JSON.stringify(result, null, 2));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[/api/predict] Error:", error);
    return NextResponse.json(
      { error: "Failed to process prediction request" },
      { status: 500 }
    );
  }
}
