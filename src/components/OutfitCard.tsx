import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Heart, Download, Share } from "lucide-react";
import { SkeletonOutfitCard } from "./SkeletonCard";

interface OutfitCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  isFavorite: boolean;
  isLoading?: boolean;
  error?: string;
  onToggleFavorite?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export function OutfitCard({
  id,
  image,
  name,
  description,
  isFavorite,
  isLoading = false,
  error,
  onToggleFavorite,
  onDownload,
  onShare,
}: OutfitCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleView = () => {
    navigate(`/outfits/${id}`);
  };

  if (isLoading) {
    return <SkeletonOutfitCard />;
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-4">
          <p className="text-sm text-red-500">Error loading outfit: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-col">
        <div className="relative aspect-square">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full rounded-t-lg"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/default-outfit-placeholder.png';
            }}
          />
        </div>
        <CardTitle className="text-lg font-semibold mt-2">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onDownload}
              aria-label="Download outfit"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              aria-label="Share outfit"
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}