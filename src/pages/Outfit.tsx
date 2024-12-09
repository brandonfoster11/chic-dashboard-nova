import { Button } from "@/components/ui/button";
import { StyleCard } from "@/components/StyleCard";
import { OutfitCard } from "@/components/OutfitCard";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const Outfit = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Generated Outfits</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search outfits..."
                className="pl-10 w-[200px] md:w-[300px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <OutfitCard
            imageUrl="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
            title="Summer Casual"
            description="AI-generated summer outfit from your wardrobe"
          />
          <OutfitCard
            imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            title="Business Meeting"
            description="Professional attire curated by AI"
          />
          <OutfitCard
            imageUrl="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
            title="Evening Out"
            description="Perfect combination for dinner dates"
          />
          <OutfitCard
            imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            title="Weekend Brunch"
            description="Casual chic ensemble for brunches"
          />
        </div>
      </div>
    </div>
  );
};

export default Outfit;