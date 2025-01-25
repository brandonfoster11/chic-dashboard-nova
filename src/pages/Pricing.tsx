import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Basic wardrobe management",
        "Up to 50 items",
        "3 outfit combinations",
        "Basic style suggestions",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      features: [
        "Advanced wardrobe management",
        "Unlimited items",
        "Unlimited outfit combinations",
        "AI style recommendations",
        "Seasonal wardrobe planning",
        "Priority support",
      ],
      cta: "Try Pro",
      popular: true,
    },
    {
      name: "Business",
      price: "$29.99",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Brand management",
        "Analytics dashboard",
        "API access",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the perfect plan for your wardrobe management needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 pt-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`p-6 space-y-6 ${
              plan.popular ? "border-primary shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <div className="text-sm font-medium text-primary mb-2">
                Most Popular
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="text-3xl font-bold">{plan.price}</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>

            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              onClick={() => navigate("/register")}
            >
              {plan.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;