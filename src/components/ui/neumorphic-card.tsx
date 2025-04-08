import * as React from "react";
import { getNeumorphicCardStyles, type NeumorphicCardProps } from "@/lib/design-system";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeumorphicCardComponentProps extends React.HTMLAttributes<HTMLDivElement>, NeumorphicCardProps {
  asChild?: boolean;
  animate?: boolean;
  delay?: number;
}

type MotionDivProps = Omit<HTMLMotionProps<"div">, keyof NeumorphicCardComponentProps> & NeumorphicCardComponentProps;

const NeumorphicCard = React.forwardRef<HTMLDivElement, NeumorphicCardComponentProps>(
  ({ className, variant, hover, padding, animate = false, delay = 0, children, ...props }, ref) => {
    const cardStyles = getNeumorphicCardStyles({ variant, hover, padding, className });
    
    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cardStyles}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            ease: "easeOut",
            delay 
          }}
          {...props as any} // Type assertion to avoid complex type issues
        >
          {children}
        </motion.div>
      );
    }
    
    return (
      <div
        ref={ref}
        className={cardStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeumorphicCard.displayName = "NeumorphicCard";

export { NeumorphicCard };
