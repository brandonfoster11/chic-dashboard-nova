import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Grid, User, Settings, Wand2, Menu, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            StyleAI
          </Link>
          <div className="hidden md:flex gap-4">
            {isAuthenticated && (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">
                    <Grid className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/wardrobe">
                  <Button variant="ghost">Wardrobe</Button>
                </Link>
                <Link to="/outfit">
                  <Button variant="ghost">Outfits</Button>
                </Link>
                <Link to="/create-outfit">
                  <Button variant="ghost" className="text-primary">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Outfit
                  </Button>
                </Link>
              </>
            )}
            <Link to="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost">Blog</Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMobileMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
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
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="ghost">
                  <User className="h-4 w-4 mr-2" />
                  {user?.name || 'Profile'}
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-0 bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="container p-4">
          <div className="space-y-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="w-full justify-start">
                    <Grid className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/wardrobe">
                  <Button variant="ghost" className="w-full justify-start">
                    Wardrobe
                  </Button>
                </Link>
                <Link to="/outfit">
                  <Button variant="ghost" className="w-full justify-start">
                    Outfits
                  </Button>
                </Link>
                <Link to="/create-outfit">
                  <Button variant="ghost" className="w-full justify-start text-primary">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Outfit
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/pricing">
                  <Button variant="ghost" className="w-full justify-start">
                    Pricing
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="ghost" className="w-full justify-start">
                    Blog
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};