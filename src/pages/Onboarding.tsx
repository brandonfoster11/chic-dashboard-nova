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
  // ... Add remaining steps following the same pattern
];

const Onboarding = () => {
  const { data, updateData, currentStep, setCurrentStep, totalSteps } = useOnboarding();
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentStepData = onboardingSteps[currentStep - 1];
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (!data[currentStepData.key as keyof typeof data]) {
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