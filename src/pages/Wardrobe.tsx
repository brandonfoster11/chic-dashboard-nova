import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WardrobeItemCard } from "@/components/WardrobeItem";
import { useWardrobeItems, useWardrobeStats, useRemoveWardrobeItem } from "@/hooks/use-wardrobe";
import { WardrobeFilters, WardrobeItem } from "@/services/wardrobe/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const Wardrobe = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<WardrobeFilters>({});
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  
  // Get wardrobe items with filters
  const { 
    data: wardrobeItems, 
    isLoading: isLoadingItems,
    isError: isItemsError,
    refetch: refetchItems
  } = useWardrobeItems({
    ...filters,
    search: searchQuery.length > 0 ? searchQuery : undefined
  });
  
  // Get wardrobe stats
  const { 
    data: wardrobeStats,
    isLoading: isLoadingStats
  } = useWardrobeStats();
  
  // Delete item mutation
  const removeItem = useRemoveWardrobeItem();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditItem = (item: WardrobeItem) => {
    navigate(`/edit-item/${item.id}`);
  };

  const handleDeleteItem = (item: WardrobeItem) => {
    setDeleteItemId(item.id);
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;
    
    try {
      await removeItem.mutateAsync(deleteItemId);
      toast.success("Item deleted successfully");
      setDeleteItemId(null);
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    }
  };

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
                value={searchQuery}
                onChange={handleSearchChange}
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

        {/* Wardrobe Stats Summary */}
        {!isLoadingStats && wardrobeStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
              <p className="text-2xl font-bold">{wardrobeStats.totalItems}</p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
              <p className="text-2xl font-bold">{wardrobeStats.categories.length}</p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Favorites</h3>
              <p className="text-2xl font-bold">{wardrobeStats.favorites.length}</p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">Recently Added</h3>
              <p className="text-2xl font-bold">{wardrobeStats.recentlyAdded.length}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingItems && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading your wardrobe...</span>
          </div>
        )}

        {/* Error State */}
        {isItemsError && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load wardrobe items</p>
            <Button onClick={() => refetchItems()}>Try Again</Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingItems && wardrobeItems && wardrobeItems.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium mb-2">Your wardrobe is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start adding items to your wardrobe to get personalized outfit recommendations
            </p>
            <Button onClick={() => navigate("/add-item")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </div>
        )}

        {/* Wardrobe Items Grid */}
        {!isLoadingItems && wardrobeItems && wardrobeItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wardrobeItems.map((item) => (
              <WardrobeItemCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItemId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={removeItem.isPending}
            >
              {removeItem.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wardrobe;