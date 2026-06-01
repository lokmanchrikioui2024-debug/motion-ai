"use client";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  gradient?: boolean;
}

export function Progress({ value, className, showLabel, gradient = true }: ProgressProps) {
  return (
    <div className={cn("relative", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Progress</span>
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            gradient
              ? "bg-gradient-to-r from-violet-500 to-blue-500"
              : "bg-violet-500"
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

export function FuturisticProgress({ value, stage }: { value: number; stage: string }) {
  const segments = 20;
  const filled = Math.round((value / 100) * segments);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm">{stage}</span>
        <span className="text-violet-400 font-mono text-sm font-semibold">{Math.round(value)}%</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-1.5 rounded-full transition-all duration-300",
              i < filled
                ? "bg-gradient-to-r from-violet-500 to-blue-500"
                : "bg-white/10"
            )}
            style={{ transitionDelay: `${i * 20}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
