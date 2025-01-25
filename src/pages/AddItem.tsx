import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here we would typically handle the form submission
    // For now, just show a success message and navigate back
    toast({
      title: "Success",
      description: "Item added to your wardrobe",
    });
    navigate("/wardrobe");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/wardrobe")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Wardrobe
        </Button>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Add New Item</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                {imagePreview ? (
                  <div className="relative w-full max-w-md aspect-square">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="absolute bottom-4 right-4"
                      onClick={() => setImagePreview(null)}
                    >
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex flex-col items-center text-sm">
                      <Label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80"
                      >
                        <span>Upload a photo</span>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </Label>
                      <p className="text-gray-500">or drag and drop</p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" placeholder="E.g., Blue Denim Jacket" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="E.g., Jackets, Pants, Shoes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" placeholder="E.g., Levi's, Nike" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add any details about the item..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/wardrobe")}
              >
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;