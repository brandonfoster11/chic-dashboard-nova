import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Save } from "lucide-react";
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
    toast({
      title: "Success",
      description: "Item added to your wardrobe",
    });
    navigate("/wardrobe");
  };

  return (
    <div className="container max-w-2xl py-8 animate-fade-up">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/wardrobe")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Wardrobe
      </Button>

      <h1 className="text-3xl font-bold mb-6">Add New Item</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
            {imagePreview ? (
              <div className="relative w-full max-w-md">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4 w-full"
                  onClick={() => setImagePreview(null)}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <label className="w-full cursor-pointer">
                <div className="flex flex-col items-center justify-center py-8">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground text-center">
                    Click to upload or drag and drop
                    <br />
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input required placeholder="e.g., Blue Denim Jacket" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input required placeholder="e.g., Jackets, Pants, Shoes" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>
            <Input placeholder="e.g., Levi's" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Add any notes about the item..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Item
        </Button>
      </form>
    </div>
  );
};

export default AddItem;