import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Grid, User, Settings, Wand2 } from "lucide-react";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="text-xl font-bold">
            StyleAI
          </a>
          <div className="hidden md:flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <Grid className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate("/wardrobe")}>
              Wardrobe
            </Button>
            <Button variant="ghost" onClick={() => navigate("/outfit")}>
              Outfits
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/create-outfit")}
              className="text-primary"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Outfit
            </Button>
            <Button variant="ghost" onClick={() => navigate("/blog")}>
              Blog
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" onClick={() => navigate("/settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </div>
    </nav>
  );
};