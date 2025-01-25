import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Your Digital Wardrobe</h1>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Your Wardrobe</h2>
            <p className="text-gray-600 mb-4">
              Manage and organize your clothing items in one place.
            </p>
            <Button 
              onClick={() => navigate("/wardrobe")}
              className="w-full"
            >
              View Wardrobe
            </Button>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
            <p className="text-gray-600 mb-4">
              Add new clothing items to your digital wardrobe.
            </p>
            <Button 
              onClick={() => navigate("/add-item")}
              className="w-full"
            >
              Add Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;