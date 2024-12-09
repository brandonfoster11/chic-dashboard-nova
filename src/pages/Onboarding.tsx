import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-4xl py-8 space-y-8 animate-fade-up">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Your Style Journey</h1>
          <p className="text-muted-foreground text-lg">Let's personalize your experience</p>
        </div>

        <div className="grid gap-8 mt-8">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Style Preferences</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Casual", "Formal", "Streetwear", "Minimalist", "Vintage", "Athletic"].map((style) => (
                <Button
                  key={style}
                  variant="outline"
                  className="h-auto p-4 hover:bg-primary/5"
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Color Preferences</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {["#000000", "#FFFFFF", "#9b87f5", "#F2FCE2", "#FFDEE2", "#6E59A5"].map((color) => (
                <button
                  key={color}
                  className="w-12 h-12 rounded-full border-2 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Skip for now
          </Button>
          <Button onClick={() => navigate("/tour")}>Continue</Button>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;