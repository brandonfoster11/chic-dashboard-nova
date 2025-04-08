import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAddWardrobeItem } from "@/hooks/use-wardrobe";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

// Define the valid item types based on OutfitItem type
const itemTypes = ['top', 'bottom', 'shoes', 'accessory'] as const;
type ItemType = typeof itemTypes[number];

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(itemTypes, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  brand: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddItem = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const addWardrobeItem = useAddWardrobeItem();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: undefined,
      brand: "",
      color: "",
      description: "",
      tags: "",
      imageUrl: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setImagePreview(imageDataUrl);
        form.setValue("imageUrl", imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Process tags from comma-separated string to array
      const tags = data.tags
        ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : [];

      // Add current date and initialize other fields
      await addWardrobeItem.mutateAsync({
        name: data.name,
        type: data.type,
        brand: data.brand || "Unknown",
        color: data.color,
        description: data.description || "",
        imageUrl: data.imageUrl || "https://via.placeholder.com/300",
        dateAdded: new Date().toISOString(),
        favorite: false,
        tags,
        wearCount: 0,
      });

      toast.success("Item added to your wardrobe");
      navigate("/wardrobe");
    } catch (error) {
      toast.error("Failed to add item");
      console.error(error);
    }
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    onClick={() => {
                      setImagePreview(null);
                      form.setValue("imageUrl", "");
                    }}
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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blue Denim Jacket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="accessory">Accessory</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Levi's" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blue, Black, White" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., casual, summer, favorite" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about the item..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={addWardrobeItem.isPending}
          >
            {addWardrobeItem.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Item
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddItem;