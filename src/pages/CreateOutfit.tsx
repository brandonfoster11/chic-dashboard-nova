import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Send } from "lucide-react";

const CreateOutfit = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>(
    []
  );
  const [input, setInput] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm your AI fashion assistant. I'll help you create the perfect outfit.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Chat Section - Now the main focus */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                } animate-fade-up`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t bg-background flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your outfit idea..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Outfit Preview Section - Now smaller */}
      <div className="w-1/3 p-6 border-l">
        <div className="bg-card rounded-lg h-full p-4">
          <h2 className="text-2xl font-bold mb-4">Outfit Preview</h2>
          <div className="aspect-square bg-accent rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Generated outfit will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOutfit;