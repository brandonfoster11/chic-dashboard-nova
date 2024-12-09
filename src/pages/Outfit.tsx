import { Button } from "@/components/ui/button";
import { StyleCard } from "@/components/StyleCard";
import { Heart, Share2, ShoppingBag } from "lucide-react";

const Outfit = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Outfit Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button className="flex-1">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Outfit Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Summer Casual Ensemble</h1>
              <p className="text-gray-600">
                A perfectly curated outfit for warm summer days, combining comfort with style.
              </p>
            </div>

            <StyleCard title="Style Details">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Style</span>
                  <span className="font-medium">Casual Chic</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Season</span>
                  <span className="font-medium">Summer</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Occasion</span>
                  <span className="font-medium">Casual, Day Out</span>
                </div>
              </div>
            </StyleCard>

            <StyleCard title="Included Items">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Linen Shirt</span>
                  <span className="font-medium">$59.99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cotton Shorts</span>
                  <span className="font-medium">$45.99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Accessories</span>
                  <span className="font-medium">$29.99</span>
                </div>
              </div>
            </StyleCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outfit;