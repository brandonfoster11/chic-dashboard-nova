import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboarding } from "@/context/OnboardingContext";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { data, updateData, currentStep, setCurrentStep, totalSteps } = useOnboarding();
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
      navigate("/tour");
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
    navigate("/tour");
  };

  // Check if this step should be shown based on conditional logic
  const shouldShowStep = () => {
    if (!currentStepData.conditional) return true;
    const { dependsOn, showWhen } = currentStepData.conditional;
    return showWhen.includes(data[dependsOn as keyof typeof data] as string);
  };

  if (!shouldShowStep()) {
    handleNext();
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl font-bold text-center">
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg text-center mb-8">{currentStepData.question}</div>

          {currentStepData.type === "radio" && (
            <RadioGroup
              value={data[currentStepData.key as keyof typeof data] as string}
              onValueChange={(value) => updateData(currentStepData.key as keyof typeof data, value)}
              className="space-y-3"
            >
              {currentStepData.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentStepData.type === "checkbox" && (
            <div className="space-y-3">
              {currentStepData.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
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
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </div>
          )}

          {currentStepData.type === "input" && (
            <Input
              value={data[currentStepData.key as keyof typeof data] as string || ""}
              onChange={(e) => updateData(currentStepData.key as keyof typeof data, e.target.value)}
              placeholder="Enter your preferred brands"
            />
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
            <Button onClick={handleNext}>
              {currentStep === totalSteps ? "Finish" : "Next"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;