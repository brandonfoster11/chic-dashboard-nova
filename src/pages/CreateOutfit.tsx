import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Send, User, Bot, ImagePlus, X, Sparkles } from "lucide-react";
import { useOutfit } from "@/contexts/OutfitContext";
import { ImageUpload } from "@/components/ImageUpload";
import { OutfitDisplay } from "@/components/OutfitDisplay";
import { GeneratedOutfit } from "@/services/outfit/types";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Interface for user uploaded images with additional properties
interface UserImage extends File {
  id: string;
  url: string;
}

const CreateOutfit = () => {
  const { 
    generateOutfit, 
    saveOutfit, 
    isGenerating, 
    generatedOutfit, 
    userImages: originalUserImages, 
    addUserImage, 
    removeUserImage, 
    clearUserImages 
  } = useOutfit();
  
  // Convert File objects to UserImage objects with URL and ID
  const userImages = originalUserImages.map((file, index) => {
    return {
      ...file,
      id: index.toString(),
      url: URL.createObjectURL(file)
    } as UserImage;
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI fashion assistant. I'll help you create the perfect outfit. What kind of outfit are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState<GeneratedOutfit | null>(null);
  const [recentOutfits, setRecentOutfits] = useState<GeneratedOutfit[]>([]);

  // Update current outfit when a new one is generated
  useEffect(() => {
    if (generatedOutfit) {
      setCurrentOutfit(generatedOutfit);
      // Add to recent outfits
      setRecentOutfits(prev => {
        const newOutfits = [generatedOutfit, ...prev];
        return newOutfits.slice(0, 5); // Keep only the 5 most recent
      });
    }
  }, [generatedOutfit]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      userImages.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [userImages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    try {
      // Add a "thinking" message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Generating your outfit...",
        },
      ]);
      
      // Generate the outfit
      const outfit = await generateOutfit(input);
      
      // Replace the "thinking" message with the result
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: `I've created an outfit based on your request: "${input}". ${outfit.description} What do you think?`,
        },
      ]);
      
      // Clear the uploaded images after generating
      clearUserImages();
      setShowImageUpload(false);
    } catch (error) {
      // Replace the "thinking" message with an error
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "I'm sorry, I couldn't generate an outfit. Please try again with a different description.",
        },
      ]);
    }
  };

  const handleSaveOutfit = async (outfit: GeneratedOutfit) => {
    try {
      await saveOutfit(outfit);
      toast.success("Outfit saved to your wardrobe");
    } catch (error) {
      toast.error("Failed to save outfit");
    }
  };

  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Create Your Perfect Outfit</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Panel - Chat & Input (3 columns) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {/* Chat Section */}
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[70vh] p-4 rounded-lg border bg-gradient-to-br from-[#ffffff] to-[#f9f5ff] dark:from-[#1c1c20] dark:to-[#15151a]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-full bg-[#f3e8ff] dark:bg-[#2d2d35] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#7c3aed] dark:text-[#a78bfa]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-[#7c3aed] text-white ml-auto"
                      : "bg-white dark:bg-[#1c1c20] shadow-sm"
                  } animate-fade-up`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-[#7c3aed] flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Suggestions */}
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-3">Quick Suggestions</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Business casual for summer",
                "Weekend brunch outfit",
                "Date night look",
                "Casual Friday at the office",
                "Outdoor workout gear"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 bg-[#f3e8ff] dark:bg-[#2d2d35] rounded-full text-xs hover:bg-[#e9d5ff] dark:hover:bg-[#3f3f46] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload Section */}
          {showImageUpload && (
            <div className="border rounded-lg p-4 bg-white dark:bg-[#1c1c20]">
              <h3 className="text-sm font-medium mb-2">Upload Reference Images</h3>
              <ImageUpload 
                onImageUpload={addUserImage}
                onImageRemove={removeUserImage}
                uploadedImages={originalUserImages}
                maxImages={3}
                maxSizeInMB={5}
              />
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your outfit idea... (e.g., 'Business casual for summer' or 'Weekend outfit for a coffee date')"
                className="min-h-[100px] resize-none pr-16 rounded-xl border-[#e9d5ff] dark:border-[#2d2d35] focus:border-[#7c3aed] dark:focus:border-[#a78bfa]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={toggleImageUpload}
                  className="h-10 w-10 rounded-full hover:bg-[#f3e8ff] dark:hover:bg-[#2d2d35]"
                  title="Upload reference images"
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-10 w-10 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-full"
                  disabled={isGenerating || !input.trim()}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
            {userImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {userImages.map((img) => (
                  <div key={img.id} className="relative w-16 h-16 rounded-md overflow-hidden">
                    <img src={img.url} alt="Reference" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeUserImage(parseInt(img.id))} 
                      className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-bl-md"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Right Panel - Outfit Preview (2 columns) */}
        <div className="lg:col-span-2 flex flex-col space-y-4 sticky top-4 self-start">
          {/* Style Preferences Section */}
          <div className="border rounded-xl p-4 bg-white dark:bg-[#1c1c20] mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Style Preferences</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#7c3aed]"></div>
                <span>Casual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#7c3aed]"></div>
                <span>Minimalist</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#7c3aed]"></div>
                <span>Earth tones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#7c3aed]"></div>
                <span>Comfortable</span>
              </div>
            </div>
          </div>

          {/* Outfit Display */}
          <OutfitDisplay 
            outfit={currentOutfit} 
            isLoading={isGenerating}
            onSave={handleSaveOutfit}
          />

          {/* Recent Outfits */}
          {recentOutfits.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Recently Generated</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                {recentOutfits.map((outfit, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-24 h-24 border rounded-md overflow-hidden cursor-pointer hover:border-[#7c3aed]"
                    onClick={() => setCurrentOutfit(outfit)}
                  >
                    <img 
                      src={outfit.items[0]?.imageUrl || '/placeholder-outfit.jpg'} 
                      alt="Recent outfit" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOutfit;