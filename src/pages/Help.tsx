import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const Help = () => {
  const faqs = [
    {
      question: "How do I add items to my wardrobe?",
      answer: "You can add items to your wardrobe by clicking the 'Add Item' button in the Wardrobe page. Upload a photo of your item and fill in the details like category, brand, and description."
    },
    {
      question: "How does the AI outfit generation work?",
      answer: "Our AI analyzes your wardrobe items, style preferences, and occasion to suggest outfit combinations. The more items you add and the more you interact with the suggestions, the better the recommendations become."
    },
    {
      question: "Can I share my outfits with others?",
      answer: "Yes! You can share your favorite outfits with the community or keep them private. Use the share button on any outfit to generate a shareable link."
    },
    {
      question: "What's included in the Pro plan?",
      answer: "The Pro plan includes unlimited wardrobe items, AI-powered style recommendations, seasonal wardrobe planning, and priority support."
    },
    {
      question: "How can I get support?",
      answer: "You can reach our support team through the help center, email support@styleai.com, or use the chat feature for immediate assistance."
    }
  ];

  return (
    <div className="container py-8 space-y-8 animate-fade-up">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold text-center">Help Center</h1>
        <p className="text-muted-foreground text-center">
          Find answers to common questions and learn how to make the most of StyleAI
        </p>
        
        <Card className="p-6">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </div>
  );
};

export default Help;