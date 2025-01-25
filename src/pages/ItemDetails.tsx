import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Share2, Edit, Trash2 } from "lucide-react";

const ItemDetails = () => {
  const item = {
    name: "Classic Denim Jacket",
    brand: "Levi's",
    category: "Outerwear",
    description: "A timeless denim jacket that goes with everything. Made from premium quality denim with a comfortable fit.",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
    dateAdded: "2024-03-15",
    timesWorn: 12,
    lastWorn: "2024-03-10",
    season: "Spring/Fall",
  };

  return (
    <div className="container py-8 animate-fade-up">
      <div className="max-w-4xl mx-auto">
        <Card className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Favorite
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{item.name}</h1>
              <p className="text-muted-foreground">{item.brand}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div>{item.category}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Season</div>
                  <div>{item.season}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Times Worn</div>
                  <div>{item.timesWorn}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last Worn</div>
                  <div>{item.lastWorn}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" className="flex-1">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ItemDetails;