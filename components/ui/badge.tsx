import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-amber-500/40 bg-amber-500/10 text-amber-300",
        gold:
          "border-amber-400/60 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-200 shadow-sm shadow-amber-500/10",
        secondary:
          "border-slate-700 bg-slate-800 text-slate-300",
        success:
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
        destructive:
          "border-rose-500/40 bg-rose-500/10 text-rose-300",
        outline: "text-slate-300 border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

