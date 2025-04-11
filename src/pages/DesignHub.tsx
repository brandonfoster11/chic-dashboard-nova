import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Design Hub Page
 * 
 * A navigation hub for designers to access all pages in the application
 * Only available in design mode
 */
const DesignHub = () => {
  const routes = [
    { path: "/", name: "Landing", description: "Main landing page" },
    { path: "/dashboard", name: "Dashboard", description: "User dashboard" },
    { path: "/wardrobe", name: "Wardrobe", description: "User's wardrobe items" },
    { path: "/outfits", name: "Outfits", description: "User's outfit collection" },
    { path: "/outfit/:id", name: "Outfit Detail", description: "View outfit details" },
    { path: "/create-outfit", name: "Create Outfit", description: "Create a new outfit" },
    { path: "/add-item", name: "Add Item", description: "Add a new wardrobe item" },
    { path: "/profile", name: "Profile", description: "User profile" },
    { path: "/settings", name: "Settings", description: "User settings" },
    { path: "/onboarding", name: "Onboarding", description: "New user onboarding" },
    { path: "/tour", name: "Tour", description: "Application tour" },
    { path: "/login", name: "Login", description: "User login" },
    { path: "/register", name: "Register", description: "User registration" },
    { path: "/forgot-password", name: "Forgot Password", description: "Password recovery" },
    { path: "/reset-password", name: "Reset Password", description: "Password reset" },
    { path: "/blog", name: "Blog", description: "Blog posts" },
    { path: "/pricing", name: "Pricing", description: "Pricing plans" },
    { path: "/help", name: "Help", description: "Help center" },
    { path: "/about", name: "About", description: "About us" },
    { path: "/terms", name: "Terms", description: "Terms of service" },
    { path: "/community", name: "Community", description: "Community page" },
    { path: "/search", name: "Search", description: "Search results" },
    { path: "/style-quiz", name: "Style Quiz", description: "Style preference quiz" },
    { path: "/admin/db-inspect", name: "Database Inspector", description: "Admin database tool" },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Design Hub</h1>
        <p className="text-gray-500">
          Navigate to any page in the application for design and testing purposes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <Card key={route.path} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>{route.name}</CardTitle>
              <CardDescription>{route.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {route.path}
                </code>
                <Link to={route.path.includes(':id') ? route.path.replace(':id', 'mock-id') : route.path}>
                  <Button variant="outline" size="sm">
                    Visit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DesignHub;
