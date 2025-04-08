import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";

const neumorphicButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_10px_rgba(var(--primary)/0.3)] hover:shadow-[0_6px_15px_rgba(var(--primary)/0.4)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.08)]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        glow: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_rgba(var(--primary)/0.3)] hover:shadow-[0_6px_20px_rgba(var(--primary)/0.5),0_0_15px_rgba(var(--primary)/0.3)]",
        neumorphic: "bg-card text-card-foreground shadow-[4px_4px_10px_rgba(0,0,0,0.06),_-4px_-4px_10px_rgba(255,255,255,0.8),_inset_1px_1px_1px_rgba(255,255,255,0.5)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.3),_-4px_-4px_10px_rgba(255,255,255,0.05),_inset_1px_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[2px_2px_5px_rgba(0,0,0,0.06),_-2px_-2px_5px_rgba(255,255,255,0.8),_inset_1px_1px_1px_rgba(255,255,255,0.5)] dark:hover:shadow-[2px_2px_5px_rgba(0,0,0,0.3),_-2px_-2px_5px_rgba(255,255,255,0.05),_inset_1px_1px_1px_rgba(255,255,255,0.05)]",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
      animate: {
        none: "",
        scale: "active:scale-95 transition-transform",
        press: "active:translate-y-0.5 transition-transform",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animate: "scale",
    },
  }
);

export interface NeumorphicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neumorphicButtonVariants> {
  asChild?: boolean;
  withMotion?: boolean;
}

type MotionButtonProps = Omit<HTMLMotionProps<"button">, keyof NeumorphicButtonProps> & NeumorphicButtonProps;

const NeumorphicButton = React.forwardRef<HTMLButtonElement, NeumorphicButtonProps>(
  ({ className, variant, size, animate, asChild = false, withMotion = false, ...props }, ref) => {
    const buttonClasses = cn(neumorphicButtonVariants({ variant, size, animate, className }));

    if (withMotion) {
      return (
        <motion.button
          className={buttonClasses}
          ref={ref}
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          {...props as any} // Type assertion to avoid complex type issues
        />
      );
    }

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        {...props}
      />
    );
  }
);
NeumorphicButton.displayName = "NeumorphicButton";

export { NeumorphicButton, neumorphicButtonVariants };
