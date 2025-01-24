import { createContext, useContext, useState } from "react";
import { OnboardingData } from "@/types/onboarding";

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (key: keyof OnboardingData, value: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<OnboardingData>({
    gender: "",
    ageRange: "",
    fashionObjective: "",
    stylePreference: "",
    bodyShape: "",
    eventTypes: [],
    colorPalettes: [],
    fitPreference: "",
    fabricPreferences: [],
    shoppingFrequency: "",
    brandPreference: "",
    shoppingPreference: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 13;

  const updateData = (key: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <OnboardingContext.Provider
      value={{ data, updateData, currentStep, setCurrentStep, totalSteps }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};