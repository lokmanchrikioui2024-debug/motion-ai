import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm text-slate-400 font-medium">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl",
              "px-4 py-3 text-white placeholder-slate-600 text-sm",
              "focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06]",
              "transition-all duration-200",
              icon && "pl-10",
              error && "border-red-500/50",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
