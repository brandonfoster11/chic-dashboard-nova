import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StyleCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const StyleCard = ({ title, children, className = "" }: StyleCardProps) => {
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="bg-primary/5 pb-4">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
};