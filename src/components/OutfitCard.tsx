import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OutfitCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

export const OutfitCard = ({ imageUrl, title, description }: OutfitCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <Button variant="outline" className="w-full">View Details</Button>
      </CardContent>
    </Card>
  );
};