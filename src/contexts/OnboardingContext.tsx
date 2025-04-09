import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { RepositoryFactory } from '@/repositories/repository-factory';
import { supabase } from '@/lib/supabase';

interface OnboardingData {
  gender?: string;
  ageRange?: string;
  fashionObjective?: string;
  stylePreference?: string;
  bodyShape?: string;
  eventTypes?: string[];
  colorPalettes?: string[];
  fitPreference?: string;
  fabricPreferences?: string[];
  shoppingFrequency?: string;
  brandPreference?: string;
  preferredBrands?: string;
  shoppingPreference?: string;
  [key: string]: any;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  savePreferences: () => Promise<boolean>;
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 13; // Total number of steps in the onboarding process

  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData(prevData => ({
      ...prevData,
      [key]: value
    }));
  };

  const savePreferences = async (): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const profileRepo = RepositoryFactory.getInstance(supabase).getProfileRepository();
      
      // Format the data for storage
      const stylePreferences = {
        gender: data.gender,
        ageRange: data.ageRange,
        fashionObjective: data.fashionObjective,
        stylePreference: data.stylePreference,
        bodyShape: data.bodyShape,
        eventTypes: data.eventTypes || [],
        colorPalettes: data.colorPalettes || [],
        fitPreference: data.fitPreference,
        fabricPreferences: data.fabricPreferences || [],
        shoppingFrequency: data.shoppingFrequency,
        brandPreference: data.brandPreference,
        preferredBrands: data.preferredBrands,
        shoppingPreference: data.shoppingPreference
      };
      
      // Update the user's profile with their style preferences
      await profileRepo.update(user.id, {
        style_preferences: stylePreferences,
        onboarding_completed: true
      });
      
      console.log('Preferences saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        currentStep,
        setCurrentStep,
        totalSteps,
        savePreferences,
        isLoading
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
