import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StyleCard } from "@/components/StyleCard";
import { Camera, Edit2 } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-8 animate-fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <Button
              size="icon"
              className="absolute bottom-0 right-0 rounded-full"
              variant="secondary"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <StyleCard title="Personal Information">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input defaultValue="Alex Johnson" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input defaultValue="alex@example.com" type="email" />
                </div>
              </div>
            </StyleCard>

            <StyleCard title="Style Preferences">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Preferred Styles</span>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Minimalist", "Casual", "Modern"].map((style) => (
                    <div
                      key={style}
                      className="px-3 py-1 bg-secondary rounded-full text-sm"
                    >
                      {style}
                    </div>
                  ))}
                </div>
              </div>
            </StyleCard>

            <StyleCard title="Account Statistics">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Outfits Created</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Items in Wardrobe</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-sm text-muted-foreground">Style Match Rate</div>
                </div>
              </div>
            </StyleCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;