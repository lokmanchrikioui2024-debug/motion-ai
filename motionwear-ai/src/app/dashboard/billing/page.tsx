"use client";
import { useEffect, useState } from "react";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { fetchPricingPlans } from "@/data/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const planIcons = { free: Zap, pro: Crown, business: Building2 };

export default function BillingPage() {
  const [annual, setAnnual] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => { fetchPricingPlans().then(p => setPlans(p ?? [])).catch(() => {}); }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Billing & Plans</h1>
        <p className="text-slate-500 mt-1">Choose the plan that scales with your brand</p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={cn("text-sm", !annual ? "text-white font-medium" : "text-slate-500")}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={cn(
            "w-12 h-6 rounded-full transition-all duration-300 relative",
            annual ? "bg-violet-500" : "bg-white/10"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300",
            annual ? "left-6" : "left-0.5"
          )} />
        </button>
        <span className={cn("text-sm", annual ? "text-white font-medium" : "text-slate-500")}>
          Annual <Badge variant="success" className="ml-1">Save 20%</Badge>
        </span>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const Icon = planIcons[plan.id as keyof typeof planIcons];
          const price = annual ? Math.round(plan.price * 0.8) : plan.price;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl p-6 border transition-all duration-300",
                plan.popular
                  ? "bg-gradient-to-b from-violet-500/10 to-blue-500/5 border-violet-500/30 shadow-lg shadow-violet-500/10"
                  : "bg-[#0f0f1a] border-white/[0.06] hover:border-white/[0.12]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                  plan.popular ? "bg-violet-500/20" : "bg-white/[0.05]"
                )}>
                  <Icon size={18} className={plan.popular ? "text-violet-400" : "text-slate-400"} />
                </div>
                <h3 className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">${price}</span>
                  <span className="text-slate-500 text-sm">/{annual ? "mo" : "month"}</span>
                </div>
                {annual && plan.price > 0 && (
                  <p className="text-emerald-400 text-xs mt-1">Billed annually (${price * 12}/yr)</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      plan.popular ? "bg-violet-500/20" : "bg-emerald-500/10"
                    )}>
                      <Check size={9} className={plan.popular ? "text-violet-400" : "text-emerald-400"} />
                    </div>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "primary" : "secondary"}
                className="w-full"
              >
                {plan.price === 0 ? "Get Started Free" : `Get ${plan.name}`}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Current Plan Info */}
      <div className="rounded-2xl p-6 bg-[#0f0f1a] border border-white/[0.06]">
        <h3 className="text-white font-semibold mb-4">Current Subscription</h3>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Crown size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="text-white font-medium">Pro Plan</p>
              <p className="text-slate-500 text-sm">Renews on June 15, 2025 · $49/month</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm">Cancel Plan</Button>
            <Button variant="secondary" size="sm">Manage Billing</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
