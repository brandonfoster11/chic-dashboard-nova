import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome! Let's get to know you",
    question: "What clothes do you wear?",
    type: "radio",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "prefer_not_say", label: "Prefer not to say" },
    ],
    key: "gender",
  },
  {
    id: 2,
    title: "Age Range",
    question: "What is your age range?",
    type: "radio",
    options: [
      { value: "under_18", label: "Under 18" },
      { value: "18-24", label: "18-24" },
      { value: "25-34", label: "25-34" },
      { value: "35-44", label: "35-44" },
      { value: "45-54", label: "45-54" },
      { value: "55_plus", label: "55 and over" },
    ],
    key: "ageRange",
  },
  {
    id: 3,
    title: "Fashion Objective",
    question: "What's your main fashion objective?",
    type: "radio",
    options: [
      { value: "budget", label: "Stay stylish on a budget" },
      { value: "versatile", label: "Build a versatile wardrobe" },
      { value: "trends", label: "Keep up with trends" },
      { value: "signature", label: "Build a signature style" },
      { value: "events", label: "Dress for specific events/occasions" },
    ],
    key: "fashionObjective",
  },
  {
    id: 4,
    title: "Style Preference",
    question: "Which style best represents you?",
    type: "radio",
    options: [
      { value: "casual", label: "Casual/Relaxed" },
      { value: "chic", label: "Chic/Minimalist" },
      { value: "streetwear", label: "Streetwear/Urban" },
      { value: "business", label: "Business/Formal" },
      { value: "sporty", label: "Sporty/Activewear" },
      { value: "bohemian", label: "Bohemian" },
      { value: "eclectic", label: "Eclectic/Unique" },
    ],
    key: "stylePreference",
  },
  {
    id: 5,
    title: "Body Shape",
    question: "Which of these best describes your body shape?",
    type: "radio",
    options: [
      { value: "slim", label: "Slim/Athletic" },
      { value: "broad", label: "Broad/Stocky" },
      { value: "muscular", label: "Muscular" },
      { value: "larger", label: "Larger Build" },
    ],
    key: "bodyShape",
  },
  {
    id: 6,
    title: "Event Types",
    question: "What types of events do you usually dress for?",
    type: "checkbox",
    options: [
      { value: "work", label: "Work/Business" },
      { value: "social", label: "Social Events/Nights Out" },
      { value: "casual", label: "Casual Daywear" },
      { value: "formal", label: "Formal Events (Weddings, Galas)" },
      { value: "active", label: "Activewear/Workouts" },
      { value: "travel", label: "Travel" },
    ],
    key: "eventTypes",
  },
  {
    id: 7,
    title: "Color Preferences",
    question: "Which color palettes do you prefer in your wardrobe?",
    type: "checkbox",
    options: [
      { value: "neutrals", label: "Neutrals (Black, White, Grey)" },
      { value: "bold", label: "Bold Colors (Reds, Yellows, Blues)" },
      { value: "pastels", label: "Pastels (Light Pink, Baby Blue)" },
      { value: "earth", label: "Earth Tones (Beige, Olive, Brown)" },
      { value: "monochrome", label: "Monochrome (Single-color outfits)" },
    ],
    key: "colorPalettes",
  },
  {
    id: 8,
    title: "Fit Preference",
    question: "How do you like your clothes to fit?",
    type: "radio",
    options: [
      { value: "fitted", label: "Tailored/Fitted" },
      { value: "loose", label: "Loose/Relaxed" },
      { value: "occasion", label: "Depends on the Occasion" },
    ],
    key: "fitPreference",
  },
  {
    id: 9,
    title: "Fabric Preferences",
    question: "Which fabrics do you feel most comfortable in?",
    type: "checkbox",
    options: [
      { value: "cotton", label: "Cotton" },
      { value: "denim", label: "Denim" },
      { value: "linen", label: "Linen" },
      { value: "silk", label: "Silk" },
      { value: "wool", label: "Wool" },
      { value: "synthetic", label: "Synthetic/Tech fabrics" },
    ],
    key: "fabricPreferences",
  },
  {
    id: 10,
    title: "Shopping Frequency",
    question: "How frequently do you add new pieces to your wardrobe?",
    type: "radio",
    options: [
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Every Few Months" },
      { value: "rarely", label: "Rarely, only when needed" },
    ],
    key: "shoppingFrequency",
  },
  {
    id: 11,
    title: "Brand Preference",
    question: "Do you prefer specific brands or stores for your wardrobe?",
    type: "radio",
    options: [
      { value: "specific", label: "Yes" },
      { value: "no_preference", label: "No preference" },
      { value: "discover", label: "I like discovering new brands" },
    ],
    key: "brandPreference",
  },
  {
    id: 12,
    title: "Preferred Brands",
    question: "Which brands do you prefer? (Optional)",
    type: "input",
    conditional: {
      dependsOn: "brandPreference",
      showWhen: ["specific"],
    },
    key: "preferredBrands",
  },
  {
    id: 13,
    title: "Shopping Preference",
    question: "How do you prefer to shop for new outfits?",
    type: "radio",
    options: [
      { value: "online", label: "Online Shopping" },
      { value: "store", label: "In-Store Shopping" },
      { value: "both", label: "Both" },
    ],
    key: "shoppingPreference",
  },
];

const Onboarding = () => {
  const { data, updateData, currentStep, setCurrentStep, totalSteps, savePreferences } = useOnboarding();
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentStepData = onboardingSteps[currentStep - 1];
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (!data[currentStepData.key as keyof typeof data] && currentStepData.type !== "input") {
      toast({
        title: "Please make a selection",
        description: "This field is required to continue.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === totalSteps) {
      // Save the user's preferences to their profile
      savePreferences().then((success) => {
        if (success) {
          toast({
            title: "Setup complete!",
            description: "Your profile has been created successfully.",
            duration: 3000,
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Error saving preferences",
            description: "There was an error saving your preferences. You can update them later in your profile settings.",
            variant: "destructive",
            duration: 5000,
          });
          navigate("/dashboard");
        }
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Setup skipped",
      description: "You can always complete your profile later.",
      duration: 3000,
    });
    navigate("/dashboard");
  };

  // Check if this step should be shown based on conditional logic
  const shouldShowStep = () => {
    if (!currentStepData.conditional) return true;
    const { dependsOn, showWhen } = currentStepData.conditional;
    return showWhen.includes(data[dependsOn as keyof typeof data] as string);
  };

  useEffect(() => {
    if (!shouldShowStep()) {
      handleNext();
    }
  }, [currentStepData, data]);

  if (!shouldShowStep()) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gray-90 flex items-center justify-center p-4">
      <NeumorphicCard variant="elevated" hover="none" padding="lg" className="w-full max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <Progress value={progress} className="h-2 bg-gray-80" />
            <motion.h1 
              className="text-2xl font-bold text-center text-gray-dark-90"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.title}
            </motion.h1>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-lg text-center text-gray-dark-80">{currentStepData.question}</div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {currentStepData.type === "radio" && (
                  <RadioGroup
                    value={data[currentStepData.key as keyof typeof data] as string}
                    onValueChange={(value) => updateData(currentStepData.key as keyof typeof data, value)}
                    className="space-y-3"
                  >
                    {currentStepData.options.map((option, index) => (
                      <motion.div 
                        key={option.value} 
                        className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-80 transition-colors"
                        variants={itemVariants}
                        custom={index}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="w-full cursor-pointer">{option.label}</Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                )}

                {currentStepData.type === "checkbox" && (
                  <div className="space-y-3">
                    {currentStepData.options.map((option, index) => (
                      <motion.div 
                        key={option.value} 
                        className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-80 transition-colors"
                        variants={itemVariants}
                        custom={index}
                      >
                        <Checkbox
                          id={option.value}
                          checked={(data[currentStepData.key as keyof typeof data] as string[])?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const currentValues = (data[currentStepData.key as keyof typeof data] as string[]) || [];
                            const newValues = checked
                              ? [...currentValues, option.value]
                              : currentValues.filter((value) => value !== option.value);
                            updateData(currentStepData.key as keyof typeof data, newValues);
                          }}
                        />
                        <Label htmlFor={option.value} className="w-full cursor-pointer">{option.label}</Label>
                      </motion.div>
                    ))}
                  </div>
                )}

                {currentStepData.type === "input" && (
                  <motion.div variants={itemVariants}>
                    <Input
                      value={data[currentStepData.key as keyof typeof data] as string || ""}
                      onChange={(e) => updateData(currentStepData.key as keyof typeof data, e.target.value)}
                      placeholder="Enter your preferred brands"
                      className="bg-gray-100 border-gray-80"
                    />
                  </motion.div>
                )}
              </motion.div>

              <motion.div 
                className="flex justify-between pt-6"
                variants={itemVariants}
              >
                <NeumorphicButton
                  variant="neumorphic"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  withMotion
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </NeumorphicButton>
                
                <NeumorphicButton 
                  variant="outline" 
                  onClick={handleSkip}
                >
                  Skip
                </NeumorphicButton>
                
                <NeumorphicButton 
                  variant="neumorphic" 
                  onClick={handleNext}
                  withMotion
                >
                  {currentStep === totalSteps ? "Finish" : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </NeumorphicButton>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default Onboarding;