import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export const QuickAction = ({ icon: Icon, label, onClick }: QuickActionProps) => {
  return (
    <Button
      variant="outline"
      className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-primary/5"
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm">{label}</span>
    </Button>
  );
};