import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98]",
        gold:
          "bg-gradient-to-r from-[#d4af37] via-[#f3d375] to-[#aa8620] text-slate-950 font-semibold shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-105 active:scale-[0.98]",
        outline:
          "border border-amber-400/40 text-amber-200 bg-transparent hover:bg-amber-400/10 hover:border-amber-400/70",
        secondary:
          "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
        ghost:
          "text-slate-300 hover:text-white hover:bg-slate-800/60",
        destructive:
          "bg-red-900/80 text-red-100 border border-red-700/50 hover:bg-red-800",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base tracking-wide",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

