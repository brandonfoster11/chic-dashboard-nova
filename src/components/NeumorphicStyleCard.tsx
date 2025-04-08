import React from "react";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeumorphicStyleCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export const NeumorphicStyleCard = ({ 
  title, 
  children, 
  className = "", 
  animate = false,
  delay = 0
}: NeumorphicStyleCardProps) => {
  const content = (
    <NeumorphicCard 
      className={cn("overflow-hidden", className)}
      variant="elevated"
      hover="glow"
      padding="lg"
      animate={animate}
      delay={delay}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-dark-90 border-b border-gray-80 pb-3">
          {title}
        </h3>
        <div className="pt-2">{children}</div>
      </div>
    </NeumorphicCard>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {content}
    </motion.div>
  );
};
