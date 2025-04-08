import { Button } from "@/components/ui/button";
import { GeneratedOutfit, OutfitItem } from "@/services/outfit/types";
import { Heart, Share2, Download } from "lucide-react";

interface OutfitDisplayProps {
  outfit: GeneratedOutfit | null;
  isLoading?: boolean;
  onSave?: (outfit: GeneratedOutfit) => void;
}

export function OutfitDisplay({ outfit, isLoading = false, onSave }: OutfitDisplayProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-bold mb-4">Generated Outfit</h2>
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!outfit) {
    return (
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-bold mb-4">Generated Outfit</h2>
        <div className="aspect-[3/4] bg-accent rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-center px-4">
            Your generated outfit will appear here as we discuss your preferences
          </p>
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
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Generated Outfit</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSave}>
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground mb-6">{outfit.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {outfit.items.map((item) => (
          <OutfitItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function OutfitItemCard({ item }: { item: OutfitItem }) {
  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <div className="aspect-square relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-background/80 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {item.type}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{item.name}</h3>
        <p className="text-xs text-muted-foreground">{item.brand}</p>
      </div>
    </div>
  );
}
