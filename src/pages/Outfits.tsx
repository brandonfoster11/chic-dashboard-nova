import { Button } from "@/components/ui/button";
import { OutfitCard } from "@/components/OutfitCard";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { OutfitService } from "@/services/service-factory";
import { toast } from "@/components/ui/use-toast";

const Outfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        setIsLoading(true);
        const fetchedOutfits = await OutfitService.getUserOutfits();
        setOutfits(fetchedOutfits);
        setError(null);
      } catch (err) {
        console.error("Error fetching outfits:", err);
        setError("Failed to load outfits. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOutfits();
  }, []);

  const handleToggleFavorite = (id) => {
    toast({
      title: "Feature not available",
      description: "Favoriting outfits is not available in design mode.",
      variant: "default",
    });
  };

  const handleDownload = (id) => {
    toast({
      title: "Feature not available",
      description: "Downloading outfits is not available in design mode.",
      variant: "default",
    });
  };

  const handleShare = (id) => {
    toast({
      title: "Feature not available",
      description: "Sharing outfits is not available in design mode.",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Outfits</h1>
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
          <Link to="/create-outfit">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Outfit
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No outfits yet</h3>
          <p className="text-gray-500 mb-6">Create your first outfit to get started</p>
          <Link to="/create-outfit">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Outfit
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {outfits.map((outfit, index) => (
            <OutfitCard
              key={outfit.id || index}
              id={outfit.id || `mock-outfit-${index}`}
              image={outfit.image_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
              name={outfit.name || `Outfit ${index + 1}`}
              description={outfit.description || "AI-generated outfit from your wardrobe"}
              isFavorite={false}
              onToggleFavorite={() => handleToggleFavorite(outfit.id)}
              onDownload={() => handleDownload(outfit.id)}
              onShare={() => handleShare(outfit.id)}
            />
          ))}
          
          {/* Fallback mock outfits if needed */}
          {outfits.length < 4 && (
            <>
              <OutfitCard
                id="mock-summer-casual"
                image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                name="Summer Casual"
                description="AI-generated summer outfit from your wardrobe"
                isFavorite={false}
                onToggleFavorite={() => handleToggleFavorite("mock-summer-casual")}
                onDownload={() => handleDownload("mock-summer-casual")}
                onShare={() => handleShare("mock-summer-casual")}
              />
              <OutfitCard
                id="mock-business-meeting"
                image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                name="Business Meeting"
                description="Professional attire curated by AI"
                isFavorite={false}
                onToggleFavorite={() => handleToggleFavorite("mock-business-meeting")}
                onDownload={() => handleDownload("mock-business-meeting")}
                onShare={() => handleShare("mock-business-meeting")}
              />
              <OutfitCard
                id="mock-evening-out"
                image="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
                name="Evening Out"
                description="Perfect combination for dinner dates"
                isFavorite={false}
                onToggleFavorite={() => handleToggleFavorite("mock-evening-out")}
                onDownload={() => handleDownload("mock-evening-out")}
                onShare={() => handleShare("mock-evening-out")}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Outfits;
