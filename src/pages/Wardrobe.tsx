import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import { OutfitCard } from "@/components/OutfitCard";
import { useNavigate } from "react-router-dom";

const Wardrobe = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">My Wardrobe</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search items..."
                className="pl-10 w-[200px] md:w-[300px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate("/add-item")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <OutfitCard
            imageUrl="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
            title="Casual Collection"
            description="Everyday comfort meets style"
          />
          <OutfitCard
            imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            title="Work Essentials"
            description="Professional attire for success"
          />
          <OutfitCard
            imageUrl="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
            title="Evening Wear"
            description="Statement pieces for special occasions"
          />
          <OutfitCard
            imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            title="Accessories"
            description="Complete your look"
          />
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;