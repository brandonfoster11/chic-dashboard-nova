import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Info,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const tourSteps = [
  {
    id: 1,
    title: "Welcome to Your Dashboard",
    description: "This is where you'll find all your important information and quick actions.",
    position: { top: "20%", left: "50%" },
  },
  {
    id: 2,
    title: "Wardrobe Management",
    description: "Upload and organize your clothing items here.",
    position: { top: "40%", left: "30%" },
  },
  {
    id: 3,
    title: "AI Style Assistant",
    description: "Get personalized outfit recommendations and style advice.",
    position: { top: "60%", left: "70%" },
  },
  {
    id: 4,
    title: "Analytics Dashboard",
    description: "Track your style preferences and wardrobe statistics.",
    position: { top: "80%", left: "50%" },
  },
];

const Tour = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = tourSteps.length;

  const handleNext = () => {
    if (currentStep === totalSteps) {
      navigate("/dashboard");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const currentTourStep = tourSteps[currentStep - 1];

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div
        className="absolute bg-card p-6 rounded-lg shadow-lg max-w-md"
        style={{
          ...currentTourStep.position,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">{currentTourStep.title}</h3>
        </div>
        <p className="text-muted-foreground mb-6">{currentTourStep.description}</p>
        <div className="flex justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Tour
          </Button>
          <Button onClick={handleNext}>
            {currentStep === totalSteps ? "Get Started" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tour;