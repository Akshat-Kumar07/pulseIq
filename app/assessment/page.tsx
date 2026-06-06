import type { Metadata } from "next";
import AssessmentWizard from "@/components/assessment/AssessmentWizard";

export const metadata: Metadata = {
  title: "Cardiovascular Risk Assessment — CardioAI",
  description:
    "Complete your cardiovascular risk assessment. Answer 13 clinical questions to receive a personalized AI-powered heart health analysis.",
};

export default function AssessmentPage() {
  return <AssessmentWizard />;
}
