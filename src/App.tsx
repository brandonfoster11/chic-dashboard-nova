import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Wardrobe from "@/pages/Wardrobe";
import AddItem from "@/pages/AddItem";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/add-item" element={<AddItem />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;