"use client";
import { useEffect, useState } from "react";
import { Sparkles, Play, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { fetchTemplates } from "@/data/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Template } from "@/types";

const categories = ["All", "Fashion", "Streetwear", "Luxury", "Sportswear", "Ecommerce"];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const [templates, setTemplates] = useState<any[]>([]);
  useEffect(() => { fetchTemplates().then(t => setTemplates(t ?? [])).catch(() => {}); }, []);

  const filtered = templates.filter(t =>
    activeCategory === "All" || t.category === activeCategory.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Templates</h1>
        <p className="text-slate-500 mt-1">Premium-crafted motion templates for every brand</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === c
                ? "bg-violet-500 text-white"
                : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group rounded-2xl overflow-hidden bg-[#0f0f1a] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300"
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {template.isPremium && (
                <div className="absolute top-2 left-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600/80 to-blue-600/80 backdrop-blur-sm">
                    <Sparkles size={10} className="text-yellow-300" />
                    <span className="text-white text-[10px] font-semibold">PRO</span>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <Play size={16} className="ml-0.5" />
                </button>
                {template.isPremium && (
                  <button className="w-10 h-10 rounded-full bg-violet-500/40 backdrop-blur flex items-center justify-center text-violet-200 hover:bg-violet-500/60 transition-colors">
                    <Lock size={14} />
                  </button>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-semibold text-sm">{template.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{template.uses.toLocaleString()} uses</p>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="default" className="text-[10px] px-1.5 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
