import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function getRiskColor(category: "low" | "moderate" | "high"): string {
  switch (category) {
    case "low":
      return "#10B981";
    case "moderate":
      return "#F59E0B";
    case "high":
      return "#EF4444";
  }
}

export function getRiskLabel(score: number): "low" | "moderate" | "high" {
  if (score >= 60) return "high";
  if (score >= 35) return "moderate";
  return "low";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
