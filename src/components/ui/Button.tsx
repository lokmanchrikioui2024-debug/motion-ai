"use client";
import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base = "relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";
    
    const variants = {
      primary: "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]",
      secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
      ghost: "text-slate-400 hover:text-white hover:bg-white/5",
      danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
      glass: "glass border-glow text-white hover:bg-white/10",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
