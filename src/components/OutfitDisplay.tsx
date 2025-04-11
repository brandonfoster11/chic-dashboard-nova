import { Button } from "@/components/ui/button";
import { GeneratedOutfit, OutfitItem } from "@/services/outfit/types";
import { Heart, Share2, Download, Sparkles } from "lucide-react";

interface OutfitDisplayProps {
  outfit: GeneratedOutfit | null;
  isLoading?: boolean;
  onSave?: (outfit: GeneratedOutfit) => void;
}

export function OutfitDisplay({ outfit, isLoading = false, onSave }: OutfitDisplayProps) {
  if (isLoading) {
    return (
      <div className="border rounded-xl p-6 bg-white dark:bg-[#1c1c20] shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Generated Outfit</h2>
        <div className="space-y-4">
          <div className="h-8 bg-[#f3e8ff] dark:bg-[#2d2d35] rounded animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-[#f3e8ff] dark:bg-[#2d2d35] rounded animate-pulse"></div>
                <div className="h-4 bg-[#f3e8ff] dark:bg-[#2d2d35] rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-[#f3e8ff] dark:bg-[#2d2d35] rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!outfit) {
    return (
      <div className="border rounded-xl p-6 bg-white dark:bg-[#1c1c20] shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Your Outfit</h2>
        <div className="aspect-[4/3] bg-[#f9f5ff] dark:bg-[#15151a] rounded-lg flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#e9d5ff] dark:bg-[#2d2d35] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#7c3aed] dark:text-[#a78bfa]" />
            </div>
            <p className="text-lg font-medium mb-2">Ready to create your outfit</p>
            <p className="text-muted-foreground text-sm">
              Describe what you're looking for and I'll generate the perfect outfit for you
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (onSave) {
      onSave(outfit);
    }
  };

  return (
    <div className="border rounded-xl p-6 bg-white dark:bg-[#1c1c20] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Outfit</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button className="rounded-full bg-[#7c3aed] hover:bg-[#6d28d9]" size="sm" onClick={handleSave}>
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="bg-[#f9f5ff] dark:bg-[#15151a] p-4 rounded-lg mb-6">
        <p className="italic">{outfit.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {outfit.items.map((item) => (
          <OutfitItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function OutfitItemCard({ item }: { item: OutfitItem }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-[#1c1c20] hover:shadow-md transition-shadow">
      <div className="aspect-square relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-[#7c3aed] text-white text-xs px-3 py-1 rounded-full">
          {item.type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm">{item.name}</h3>
        <p className="text-xs text-muted-foreground">{item.brand}</p>
        {item.price && (
          <div className="mt-2 flex justify-between items-center">
            <span className="text-sm font-semibold">${item.price}</span>
            <Button variant="ghost" size="sm" className="h-8 rounded-full">View</Button>
          </div>
        )}
      </div>
    </div>
  );
}
