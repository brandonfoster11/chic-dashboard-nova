import { Wand2, RefreshCcw, Sliders, History } from "lucide-react";
import { StyleCard } from "@/components/StyleCard";
import { OutfitCard } from "@/components/OutfitCard";
import { QuickAction } from "@/components/QuickAction";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action triggered",
      description: `${action} action was clicked`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-8 animate-fade-up">
        {/* Hero Section */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Alex</h1>
          <p className="text-gray-600">Your style today is Modern Minimalist with a touch of Casual Chic</p>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickAction
            icon={Wand2}
            label="Get New Recommendations"
            onClick={() => handleQuickAction("Recommendations")}
          />
          <QuickAction
            icon={RefreshCcw}
            label="Refresh Style"
            onClick={() => handleQuickAction("Refresh")}
          />
          <QuickAction
            icon={Sliders}
            label="Update Preferences"
            onClick={() => handleQuickAction("Preferences")}
          />
          <QuickAction
            icon={History}
            label="View History"
            onClick={() => handleQuickAction("History")}
          />
        </section>

        {/* Style Recommendations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Today's Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OutfitCard
              imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              title="Modern Work Ensemble"
              description="Perfect for your upcoming meetings"
            />
            <OutfitCard
              imageUrl="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
              title="Weekend Casual"
              description="Relaxed yet put-together look"
            />
            <OutfitCard
              imageUrl="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
              title="Evening Smart"
              description="For your dinner plans tonight"
            />
          </div>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StyleCard title="Style Analytics">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Style Match Rate</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Outfits Generated</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Favorite Style</span>
                <span className="font-medium">Modern Minimal</span>
              </div>
            </div>
          </StyleCard>
          
          <StyleCard title="Recent Activity">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Last Style Update</span>
                <span className="text-gray-600">2 days ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Purchase</span>
                <span className="text-gray-600">Yesterday</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Next Style Review</span>
                <span className="text-gray-600">In 5 days</span>
              </div>
            </div>
          </StyleCard>
        </section>
      </main>
    </div>
  );
};

export default Index;