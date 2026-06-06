import type { Metadata } from "next";
import ResultsDashboard from "@/components/results/ResultsDashboard";

export const metadata: Metadata = {
  title: "Your Results — PulseIQ",
  description:
    "View your personalized cardiovascular risk assessment results, factor analysis, and AI-generated health recommendations.",
};

export default function ResultsPage() {
  return <ResultsDashboard />;
}
