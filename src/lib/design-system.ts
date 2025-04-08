/**
 * StyleAI Design System
 * 
 * This file contains design system utilities and constants for the StyleAI application.
 * It implements the neumorphic design language with consistent spacing, typography, and animations.
 */

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

// Neumorphic shadow styles
export const neumorphicStyles = {
  // Base neumorphic card with soft shadows
  card: "bg-card rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.05),0_1px_3px_0_rgba(0,0,0,0.08)] dark:shadow-[0_4px_14px_0_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.15)]",
  
  // Elevated neumorphic card with stronger shadows
  elevated: "bg-card rounded-xl shadow-[0_10px_30px_0_rgba(0,0,0,0.08),0_2px_6px_0_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_0_rgba(0,0,0,0.15),0_2px_6px_0_rgba(0,0,0,0.1)]",
  
  // Inset neumorphic effect (pressed/active state)
  inset: "bg-card rounded-xl shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_6px_0_rgba(0,0,0,0.1),inset_0_1px_2px_0_rgba(0,0,0,0.15)]",
  
  // Glow effect for hover states
  glow: "transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary)/0.3),0_4px_10px_rgba(0,0,0,0.1)]",
};

// Typography styles
export const typography = {
  // Headings
  h1: "text-4xl font-bold tracking-tight",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-medium",
  
  // Body text
  body: "text-base text-foreground",
  bodyLarge: "text-lg text-foreground",
  bodySmall: "text-sm text-muted-foreground",
  
  // Special text styles
  lead: "text-xl text-muted-foreground",
  muted: "text-sm text-muted-foreground",
  subtle: "text-sm text-muted-foreground/80",
};

// Spacing system
export const spacing = {
  section: "space-y-12",
  container: "space-y-8",
  component: "space-y-4",
  item: "space-y-2",
};

// Layout containers
export const layout = {
  page: "container mx-auto px-4 py-8 md:px-6 md:py-12",
  content: "max-w-3xl mx-auto",
  wide: "max-w-5xl mx-auto",
  full: "w-full",
};

// Neumorphic card variants
export const neumorphicCard = cva(
  "rounded-xl p-6 transition-all duration-300", 
  {
    variants: {
      variant: {
        default: neumorphicStyles.card,
        elevated: neumorphicStyles.elevated,
        inset: neumorphicStyles.inset,
      },
      hover: {
        none: "",
        glow: neumorphicStyles.glow,
        scale: "hover:scale-[1.02] hover:" + neumorphicStyles.elevated,
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
      padding: "md",
    },
  }
);

export interface NeumorphicCardProps extends VariantProps<typeof neumorphicCard> {
  className?: string;
}

// Helper function to apply neumorphic card styles
export function getNeumorphicCardStyles(props: NeumorphicCardProps) {
  const { className, ...variantProps } = props;
  return cn(neumorphicCard(variantProps), className);
}

// Animation variants for Framer Motion
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
  },
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: "easeOut" },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
  staggerChildren: {
    animate: { transition: { staggerChildren: 0.1 } },
  },
};
