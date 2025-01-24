import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wand2, ShirtIcon, ImageIcon, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8 animate-fade-up">
      <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <ShirtIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">156</h3>
            <p className="text-muted-foreground">Items in Wardrobe</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">24</h3>
            <p className="text-muted-foreground">Generated Outfits</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">92%</h3>
            <p className="text-muted-foreground">Style Match Rate</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Wand2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">15</h3>
            <p className="text-muted-foreground">AI Suggestions</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/create-outfit")}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate New Outfit
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/wardrobe")}
            >
              <ShirtIcon className="mr-2 h-4 w-4" />
              Add Items to Wardrobe
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Generated summer casual outfit</span>
              <span className="text-muted-foreground">2h ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Added 3 new items to wardrobe</span>
              <span className="text-muted-foreground">5h ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Updated style preferences</span>
              <span className="text-muted-foreground">1d ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;