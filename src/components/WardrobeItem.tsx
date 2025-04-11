import { Button } from "@/components/ui/button";
import { WardrobeItem as WardrobeItemType } from "@/services/wardrobe/types";
import { Heart, MoreHorizontal, Calendar, Tag, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToggleFavorite, useIncrementWearCount } from "@/hooks/use-wardrobe";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

  // Format the date added
  const formattedDate = item.dateAdded ? format(new Date(item.dateAdded), 'MMM d, yyyy') : '';
  
  // Format the price if available
  const formattedPrice = item.price ? `$${item.price.toFixed(2)}` : '';

  return (
    <div className="group relative overflow-hidden bg-white dark:bg-[#1c1c20] rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="aspect-square relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 bg-black/70 text-white dark:bg-white/70 dark:text-black text-xs px-2 py-1 rounded-full backdrop-blur-sm"
        >
          {item.type}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 left-2 h-8 w-8 rounded-full bg-black/50 text-white dark:bg-white/50 dark:text-black backdrop-blur-sm",
            item.favorite ? "text-red-500" : ""
          )}
          onClick={handleToggleFavorite}
        >
          <Heart className="h-4 w-4" fill={item.favorite ? "currentColor" : "none"} />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-base truncate">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.brand}</p>
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
        
        {/* Item details */}
        <div className="space-y-2">
          {/* Price */}
          {formattedPrice && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span>{formattedPrice}</span>
            </div>
          )}
          
          {/* Date added */}
          {formattedDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Added {formattedDate}</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex gap-1.5 flex-wrap">
              {item.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full"
                >
                  <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="inline-block text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs">
              Worn: {item.wearCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
