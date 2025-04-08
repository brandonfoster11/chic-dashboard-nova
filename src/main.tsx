import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OutfitProvider } from "@/contexts/OutfitContext";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import App from "./App";
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);

// Create a single provider tree with a clear hierarchy to avoid circular dependencies
root.render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <OutfitProvider>
              <TooltipProvider>
                <OnboardingProvider>
                  <App />
                </OnboardingProvider>
              </TooltipProvider>
            </OutfitProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>
);
