
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 py-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your AI-Powered
              <span className="text-primary block">Personal Stylist</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Discover outfits tailored to your style, instantly. No stress. Just confidence.
            </p>
            <div className="space-x-4">
              <Button size="lg" onClick={() => navigate("/register")}>
                Style Me for Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/wardrobe")}>
                Explore Styles
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Fashion AI"
              className="rounded-lg shadow-xl w-full max-w-lg mx-auto"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 py-16">
          <div className="p-6 bg-card rounded-lg shadow-sm text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-xl font-semibold mb-3">AI Recommendations</h3>
            <p className="text-muted-foreground">
              Get outfit suggestions that match your mood, season, and upcoming events.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm text-center">
            <div className="text-3xl mb-2">🧥</div>
            <h3 className="text-xl font-semibold mb-3">Virtual Wardrobe</h3>
            <p className="text-muted-foreground">
              Upload, organize, and manage your clothing digitally for easy outfit planning.
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm text-center">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="text-xl font-semibold mb-3">Style Analytics</h3>
            <p className="text-muted-foreground">
              See how your style evolves with visual insights and wardrobe trends.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center bg-primary text-white rounded-lg">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Style?
            </h2>
            <p className="text-xl">
              Join thousands of fashion lovers already styling smarter with AI.
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="secondary" onClick={() => navigate("/register")}>
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary" onClick={() => navigate("/tour")}>
                Take a Tour
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
