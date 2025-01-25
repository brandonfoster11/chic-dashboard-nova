import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const StyleQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const questions = [
    {
      question: "How would you describe your current style?",
      options: ["Casual", "Professional", "Trendy", "Classic", "Eclectic"],
    },
    {
      question: "What colors do you prefer wearing?",
      options: ["Neutrals", "Bright Colors", "Pastels", "Dark Tones", "Mix of All"],
    },
    {
      question: "What's your typical dress code?",
      options: ["Business Formal", "Business Casual", "Smart Casual", "Casual", "Creative"],
    },
    {
      question: "Which brands do you usually shop from?",
      options: ["Luxury", "High Street", "Sustainable", "Vintage", "Mix of All"],
    },
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="container py-12 animate-fade-up">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center">Style Quiz</h1>
          <p className="text-center text-muted-foreground">
            Let's discover your personal style preferences
          </p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card className="p-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {questions[currentStep].question}
            </h2>
            <div className="grid gap-4">
              {questions[currentStep].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-12"
                  onClick={handleNext}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
          >
            {currentStep === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StyleQuiz;