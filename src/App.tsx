import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Wardrobe from "./pages/Wardrobe";
import Outfit from "./pages/Outfit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateOutfit from "./pages/CreateOutfit";
import Onboarding from "./pages/Onboarding";
import Tour from "./pages/Tour";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Blog from "./pages/Blog";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import AddItem from "./pages/AddItem";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Community from "./pages/Community";
import Search from "./pages/Search";
import ItemDetails from "./pages/ItemDetails";
import StyleQuiz from "./pages/StyleQuiz";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" enableSystem>
      <TooltipProvider>
        <OnboardingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/tour" element={<Tour />} />
                  <Route path="/dashboard" element={<Index />} />
                  <Route path="/wardrobe" element={<Wardrobe />} />
                  <Route path="/outfit" element={<Outfit />} />
                  <Route path="/create-outfit" element={<CreateOutfit />} />
                  <Route path="/add-item" element={<AddItem />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/item/:id" element={<ItemDetails />} />
                  <Route path="/style-quiz" element={<StyleQuiz />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </OnboardingProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;