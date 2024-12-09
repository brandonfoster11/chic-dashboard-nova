import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wand2, Shirt, Settings2, MessageSquare } from "lucide-react";

const Tour = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Wand2,
      title: "AI Styling",
      description: "Get personalized outfit recommendations powered by AI",
    },
    {
      icon: Shirt,
      title: "Virtual Wardrobe",
      description: "Organize and manage your clothing collection",
    },
    {
      icon: MessageSquare,
      title: "Style Assistant",
      description: "Chat with our AI to create perfect outfits",
    },
    {
      icon: Settings2,
      title: "Customization",
      description: "Tailor the app to your preferences",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-4xl py-8 space-y-8 animate-fade-up">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Let's Get Started</h1>
          <p className="text-muted-foreground text-lg">Here's what you can do with our app</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Skip Tour
          </Button>
          <Button onClick={() => navigate("/dashboard")}>Get Started</Button>
        </div>
      </main>
    </div>
  );
};

export default Tour;