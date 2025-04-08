import { useState, useEffect, useRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command";
import { Search, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | null>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  
  const faqs = [
    {
      id: "add-items",
      question: "How do I add items to my wardrobe?",
      answer: "You can add items to your wardrobe by clicking the 'Add Item' button in the Wardrobe page. Upload a photo of your item and fill in the details like category, brand, and description.",
      category: "wardrobe",
      link: { url: "/wardrobe/add", label: "Go to Add Item" }
    },
    {
      id: "ai-generation",
      question: "How does the AI outfit generation work?",
      answer: "Our AI analyzes your wardrobe items, style preferences, and occasion to suggest outfit combinations. The more items you add and the more you interact with the suggestions, the better the recommendations become.",
      category: "outfits",
      link: { url: "/create-outfit", label: "Try Outfit Generation" }
    },
    {
      id: "sharing",
      question: "Can I share my outfits with others?",
      answer: "Yes! You can share your favorite outfits with the community or keep them private. Use the share button on any outfit to generate a shareable link.",
      category: "outfits",
      link: { url: "/outfits", label: "View Your Outfits" }
    },
    {
      id: "pro-plan",
      question: "What's included in the Pro plan?",
      answer: "The Pro plan includes unlimited wardrobe items, AI-powered style recommendations, seasonal wardrobe planning, and priority support.",
      category: "account",
      link: { url: "/pricing", label: "View Pricing Plans" }
    },
    {
      id: "support",
      question: "How can I get support?",
      answer: "You can reach our support team through the help center, email support@styleai.com, or use the chat feature for immediate assistance.",
      category: "account",
      link: null
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  // Scroll to the active accordion item when it changes
  useEffect(() => {
    if (activeAccordionItem && accordionRef.current) {
      const element = document.getElementById(activeAccordionItem);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [activeAccordionItem]);

  // Handle search result selection
  const handleSelectSearchResult = (faqId: string) => {
    setActiveAccordionItem(faqId);
    setSearchQuery("");
  };

  return (
    <div className="container py-8 space-y-8 animate-fade-up">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center" id="help-center-heading">Help Center</h1>
        <p className="text-muted-foreground text-center">
          Find answers to common questions and learn how to make the most of StyleAI
        </p>
        
        {/* Search Command */}
        <div className="relative">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search for help..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            {searchQuery && (
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Results">
                  <ScrollArea className="h-[200px]">
                    {filteredFaqs.map((faq) => (
                      <CommandItem
                        key={faq.id}
                        value={faq.id}
                        onSelect={() => handleSelectSearchResult(faq.id)}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        <span>{faq.question}</span>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>
        
        {/* FAQ Section */}
        <Card className="p-6">
          <nav aria-labelledby="faq-heading" ref={accordionRef}>
            <h2 id="faq-heading" className="sr-only">Frequently Asked Questions</h2>
            <Accordion 
              type="single" 
              collapsible 
              className="space-y-2"
              value={activeAccordionItem || undefined}
              onValueChange={(value) => setActiveAccordionItem(value)}
            >
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} id={faq.id}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>{faq.answer}</p>
                    {faq.link && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={faq.link.url} aria-label={faq.link.label}>
                          {faq.link.label} <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>
        </Card>
        
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-4 flex flex-col items-center text-center space-y-2">
            <Mail className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Email Support</h3>
            <p className="text-sm text-muted-foreground">Get help via email</p>
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@styleai.com" aria-label="Contact support via email">
                support@styleai.com
              </a>
            </Button>
          </Card>
          
          <Card className="p-4 flex flex-col items-center text-center space-y-2">
            <MessageCircle className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Live Chat</h3>
            <p className="text-sm text-muted-foreground">Chat with our support team</p>
            <Button variant="outline" size="sm" asChild>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Chat feature coming soon!'); }} aria-label="Open live chat">
                Start Chat
              </a>
            </Button>
          </Card>
          
          <Card className="p-4 flex flex-col items-center text-center space-y-2">
            <Search className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Knowledge Base</h3>
            <p className="text-sm text-muted-foreground">Browse all articles</p>
            <Button variant="outline" size="sm" asChild>
              <a href="/knowledge-base" aria-label="Browse knowledge base articles">
                View Articles
              </a>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;