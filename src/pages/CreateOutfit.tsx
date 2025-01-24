import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Send, User, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CreateOutfit = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI fashion assistant. I'll help you create the perfect outfit. What kind of outfit are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I understand you're looking for an outfit. Let me help you create something based on your preferences and style.",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Chat Section */}
      <div className="flex flex-col space-y-4 mb-8">
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

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
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
          <Button 
            type="submit" 
            size="icon" 
            className="h-auto"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Outfit Preview Section */}
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-bold mb-4">Generated Outfit</h2>
        <div className="aspect-[3/4] bg-accent rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-center px-4">
            Your generated outfit will appear here as we discuss your preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateOutfit;