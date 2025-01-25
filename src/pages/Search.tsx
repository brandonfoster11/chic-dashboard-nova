import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search as SearchIcon, Filter } from "lucide-react";

const Search = () => {
  const results = [
    {
      type: "Item",
      title: "Blue Denim Jacket",
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
      description: "Classic denim jacket perfect for casual outfits",
    },
    {
      type: "Outfit",
      title: "Summer Casual",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
      description: "Light and comfortable outfit for warm days",
    },
    {
      type: "User",
      title: "Sarah Style",
      image: "https://i.pravatar.cc/150?img=5",
      description: "Fashion influencer and style consultant",
    },
  ];

  return (
    <div className="container py-8 space-y-8 animate-fade-up">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items, outfits, or users..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex gap-4">
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {result.type}
                  </div>
                  <h3 className="font-semibold">{result.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;