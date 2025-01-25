import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Sparkles, Shield } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Personal Style",
      description: "We believe everyone deserves to feel confident in their personal style."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Community",
      description: "Join a community of fashion enthusiasts sharing style tips and inspiration."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "AI Innovation",
      description: "Cutting-edge AI technology for personalized style recommendations."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Privacy First",
      description: "Your data is secure and your privacy is our top priority."
    }
  ];

  return (
    <div className="container py-12 space-y-12 animate-fade-up">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">About StyleAI</h1>
        <p className="text-lg text-muted-foreground">
          Revolutionizing personal style through AI-powered fashion technology
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="p-8 text-center space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            At StyleAI, we're on a mission to make personal styling accessible to everyone. 
            Through innovative AI technology and a passionate community, we're helping people 
            discover and express their unique style with confidence.
          </p>
          <Button size="lg">Join Our Community</Button>
        </Card>
      </div>
    </div>
  );
};

export default About;