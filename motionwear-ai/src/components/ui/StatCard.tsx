"use client";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  change: number;
  format?: "number" | "currency" | "percentage";
  icon: React.ReactNode;
  gradient?: string;
}

export function StatCard({ label, value, change, format = "number", icon, gradient }: StatCardProps) {
  const isPositive = change >= 0;

  const displayValue =
    format === "currency"
      ? formatCurrency(value)
      : format === "percentage"
      ? `${value}%`
      : formatNumber(value);

  return (
    <div className="rounded-2xl p-6 bg-[#0f0f1a] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", gradient || "bg-violet-500/10")}>
          <span className="text-violet-400">{icon}</span>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
        )}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-2xl font-bold text-white font-display mb-1">{displayValue}</div>
      <div className="text-slate-500 text-sm">{label}</div>
    </div>
  );
}
