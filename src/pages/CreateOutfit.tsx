import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Send, User, Bot, ImagePlus } from "lucide-react";
import { useOutfit } from "@/contexts/OutfitContext";
import { ImageUpload } from "@/components/ImageUpload";
import { OutfitDisplay } from "@/components/OutfitDisplay";
import { GeneratedOutfit } from "@/services/outfit/types";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CreateOutfit = () => {
  const { 
    generateOutfit, 
    saveOutfit, 
    isGenerating, 
    generatedOutfit, 
    userImages, 
    addUserImage, 
    removeUserImage, 
    clearUserImages 
  } = useOutfit();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI fashion assistant. I'll help you create the perfect outfit. What kind of outfit are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState<GeneratedOutfit | null>(null);

  // Update current outfit when a new one is generated
  useEffect(() => {
    if (generatedOutfit) {
      setCurrentOutfit(generatedOutfit);
    }
  }, [generatedOutfit]);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chat Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[60vh] p-4 rounded-lg border bg-background">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  } animate-fade-up`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Image Upload Section */}
          {showImageUpload && (
            <div className="border rounded-lg p-4 bg-card">
              <h3 className="text-sm font-medium mb-2">Upload Reference Images</h3>
              <ImageUpload 
                onImageUpload={addUserImage}
                onImageRemove={removeUserImage}
                uploadedImages={userImages}
                maxImages={3}
                maxSizeInMB={5}
              />
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your outfit idea..."
                className="flex-1 min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={toggleImageUpload}
                  className="h-10 w-10"
                  title="Upload reference images"
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-10 w-10"
                  disabled={isGenerating || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {userImages.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {userImages.length} image{userImages.length > 1 ? 's' : ''} attached
              </p>
            )}
          </form>
        </div>

        {/* Outfit Preview Section */}
        <OutfitDisplay 
          outfit={currentOutfit} 
          isLoading={isGenerating}
          onSave={handleSaveOutfit}
        />
      </div>
    </div>
  );
};

export default CreateOutfit;