import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Loader2, Sparkles } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Wardrobe = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<WardrobeFilters>({});
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Apply filters based on tab
    if (value === "all") {
      setFilters({});
    } else if (value === "tops") {
      setFilters({ type: ["top"] });
    } else if (value === "bottoms") {
      setFilters({ type: ["bottom"] });
    } else if (value === "outerwear") {
      setFilters({ type: ["outerwear"] });
    } else if (value === "footwear") {
      setFilters({ type: ["footwear", "shoes"] });
    } else if (value === "accessories") {
      setFilters({ type: ["accessory"] });
    } else if (value === "favorites") {
      setFilters({ favorite: true });
    }
  };

  // Filter items based on wear count for "Most Worn" section
  const mostWornItems = wardrobeItems 
    ? [...wardrobeItems].sort((a, b) => b.wearCount - a.wearCount).slice(0, 4)
    : [];

  // Get recently added items
  const recentlyAddedItems = wardrobeItems
    ? [...wardrobeItems]
        .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        .slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#f3e8ff] dark:from-[#0f0f11] dark:to-[#1a1a1e] p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold">My Wardrobe</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search items..."
                className="pl-10 w-[200px] md:w-[300px] bg-white/90 dark:bg-[#1c1c20]/90 backdrop-blur-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFiltersDialog(true)}
              className="bg-white/90 dark:bg-[#1c1c20]/90 backdrop-blur-sm"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate("/add-item")}
              className="bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Wardrobe Stats Summary */}
        {!isLoadingStats && wardrobeStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/90 dark:bg-[#1c1c20]/90 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
              <p className="text-2xl font-bold">{wardrobeStats.totalItems}</p>
            </div>
            <div className="bg-white/90 dark:bg-[#1c1c20]/90 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
              <p className="text-2xl font-bold">{wardrobeStats.categories.length}</p>
            </div>
            <div className="bg-white/90 dark:bg-[#1c1c20]/90 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-sm font-medium text-muted-foreground">Favorites</h3>
              <p className="text-2xl font-bold">{wardrobeStats.favorites.length}</p>
            </div>
            <div className="bg-white/90 dark:bg-[#1c1c20]/90 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
              <h3 className="text-sm font-medium text-muted-foreground">Most Worn</h3>
              <p className="text-2xl font-bold">{wardrobeStats.mostWorn?.wearCount || 0} times</p>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="bg-white/70 dark:bg-[#1c1c20]/70 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="tops">Tops</TabsTrigger>
            <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
            <TabsTrigger value="outerwear">Outerwear</TabsTrigger>
            <TabsTrigger value="footwear">Footwear</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* AI Outfit Suggestions Banner */}
        <div className="mb-8 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                AI Outfit Suggestions
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Let our AI create the perfect outfit from your wardrobe items
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
              onClick={() => navigate("/generate-outfit")}
            >
              Generate Outfit
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingItems && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading your wardrobe...</span>
          </div>
        )}

        {/* Error State */}
        {isItemsError && (
          <div className="text-center py-12 bg-white/80 dark:bg-[#1c1c20]/80 backdrop-blur-sm rounded-lg">
            <p className="text-destructive mb-4">Failed to load wardrobe items</p>
            <Button onClick={() => refetchItems()}>Try Again</Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingItems && wardrobeItems && wardrobeItems.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg bg-white/80 dark:bg-[#1c1c20]/80 backdrop-blur-sm">
            <h3 className="text-xl font-medium mb-2">Your wardrobe is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start adding items to your wardrobe to get personalized outfit recommendations
            </p>
            <Button 
              onClick={() => navigate("/add-item")}
              className="bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </div>
        )}

        {/* Most Worn Items Section */}
        {!isLoadingItems && mostWornItems.length > 0 && activeTab === "all" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Most Worn Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {mostWornItems.map((item) => (
                <WardrobeItemCard
                  key={`most-worn-${item.id}`}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently Added Items Section */}
        {!isLoadingItems && recentlyAddedItems.length > 0 && activeTab === "all" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recentlyAddedItems.map((item) => (
                <WardrobeItemCard
                  key={`recent-${item.id}`}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Wardrobe Items Grid */}
        {!isLoadingItems && wardrobeItems && wardrobeItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {activeTab === "all" ? "All Items" : 
               activeTab === "favorites" ? "Favorite Items" : 
               `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </h2>
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
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <DialogContent className="bg-white dark:bg-[#1c1c20]">
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

      {/* Filters Dialog */}
      <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
        <DialogContent className="bg-white dark:bg-[#1c1c20]">
          <DialogHeader>
            <DialogTitle>Filter Wardrobe</DialogTitle>
            <DialogDescription>
              Refine your wardrobe view with these filters
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="brand" className="text-right">Brand</label>
              <Select onValueChange={(value) => setFilters({...filters, brand: [value]})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {wardrobeStats?.categories
                    .filter(cat => cat.name.startsWith('brand:'))
                    .map(cat => (
                      <SelectItem key={cat.id} value={cat.name.replace('brand:', '')}>
                        {cat.name.replace('brand:', '')} ({cat.count})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="color" className="text-right">Color</label>
              <Select onValueChange={(value) => setFilters({...filters, color: [value]})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {wardrobeStats?.categories
                    .filter(cat => cat.name.startsWith('color:'))
                    .map(cat => (
                      <SelectItem key={cat.id} value={cat.name.replace('color:', '')}>
                        {cat.name.replace('color:', '')} ({cat.count})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="tags" className="text-right">Tags</label>
              <Select onValueChange={(value) => setFilters({...filters, tags: [value]})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  {wardrobeStats?.categories
                    .filter(cat => cat.name.startsWith('tag:'))
                    .map(cat => (
                      <SelectItem key={cat.id} value={cat.name.replace('tag:', '')}>
                        {cat.name.replace('tag:', '')} ({cat.count})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFilters({});
              setShowFiltersDialog(false);
            }}>
              Reset
            </Button>
            <Button onClick={() => setShowFiltersDialog(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wardrobe;