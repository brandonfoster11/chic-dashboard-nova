export type OnboardingStep = {
  id: number;
  title: string;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
  type: 'radio' | 'select' | 'multiselect' | 'input';
  conditional?: {
    dependsOn: string;
    showWhen: string[];
  };
};

export type OnboardingData = {
  gender: string;
  ageRange: string;
  fashionObjective: string;
  stylePreference: string;
  bodyShape: string;
  eventTypes: string[];
  colorPalettes: string[];
  fitPreference: string;
  fabricPreferences: string[];
  shoppingFrequency: string;
  brandPreference: string;
  preferredBrands?: string;
  shoppingPreference: string;
};