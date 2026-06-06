import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssessmentFormData, AssessmentStep } from "./types";

interface AssessmentState {
  currentStep: AssessmentStep;
  formData: Partial<AssessmentFormData>;
  isSubmitting: boolean;
  setStep: (step: AssessmentStep) => void;
  updateFormData: (data: Partial<AssessmentFormData>) => void;
  setSubmitting: (val: boolean) => void;
  reset: () => void;
}

const initialFormData: Partial<AssessmentFormData> = {};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: initialFormData,
      isSubmitting: false,
      setStep: (step) => set({ currentStep: step }),
      updateFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      setSubmitting: (val) => set({ isSubmitting: val }),
      reset: () =>
        set({ currentStep: 1, formData: initialFormData, isSubmitting: false }),
    }),
    {
      name: "cardioai-assessment-v2",
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
      }),
    }
  )
);
