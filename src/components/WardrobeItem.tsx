import { Button } from "@/components/ui/button";
import { WardrobeItem as WardrobeItemType } from "@/services/wardrobe/types";
import { Heart, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToggleFavorite, useIncrementWearCount } from "@/hooks/use-wardrobe";

interface WardrobeItemProps {
  item: WardrobeItemType;
  onEdit?: (item: WardrobeItemType) => void;
  onDelete?: (item: WardrobeItemType) => void;
}

export function WardrobeItemCard({ item, onEdit, onDelete }: WardrobeItemProps) {
  const toggleFavorite = useToggleFavorite();
  const incrementWearCount = useIncrementWearCount();

  const handleToggleFavorite = () => {
    toggleFavorite.mutate(item.id);
  };

  const handleWear = () => {
    incrementWearCount.mutate(item.id);
  };

  return (
    <div className="group relative border rounded-lg overflow-hidden bg-card transition-all hover:shadow-md">
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
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 left-2 h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm",
            item.favorite ? "text-red-500" : "text-muted-foreground"
          )}
          onClick={handleToggleFavorite}
        >
          <Heart className="h-4 w-4" fill={item.favorite ? "currentColor" : "none"} />
        </Button>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-sm truncate">{item.name}</h3>
            <p className="text-xs text-muted-foreground">{item.brand}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleWear}>
                Wear today
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(item)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-1 flex-wrap">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block text-xs bg-muted px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="inline-block text-xs bg-muted px-2 py-0.5 rounded-full">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Worn: {item.wearCount}
          </p>
        </div>
      </div>
    </div>
  );
}
