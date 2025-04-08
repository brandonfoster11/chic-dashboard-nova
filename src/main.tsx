import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OutfitProvider } from "@/contexts/OutfitContext";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
