import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { USE_MOCKS } from "./constants";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Wardrobe from "./pages/Wardrobe";
import Outfit from "./pages/Outfit";
import Outfits from "./pages/Outfits";
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
import DatabaseInspector from "./pages/admin/DbInspect";
import DesignHub from "./pages/DesignHub";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Auto-skip login pages when in design mode
  useEffect(() => {
    if (USE_MOCKS) {
      const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
      if (authPages.includes(location.pathname)) {
        console.log('Design Mode: Auto-skipping auth page, redirecting to dashboard');
        navigate('/dashboard');
      }
    }
  }, [location.pathname, navigate]);
  
  return (
    <>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-gray-90 text-gray-dark-80 font-sans antialiased">
        <Navbar />
        <main className="flex-1 px-6 lg:px-12 pt-16 pb-32 space-y-12">
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
            <Route path="/outfits" element={<Outfits />} />
            <Route path="/outfit/:id" element={<Outfit />} />
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
            <Route path="/admin/db-inspect" element={<DatabaseInspector />} />
            {USE_MOCKS && <Route path="/design-hub" element={<DesignHub />} />}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;