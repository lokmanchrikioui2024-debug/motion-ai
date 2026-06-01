"use client";
import { useEffect, useState } from "react";
import { Grid, List, Upload, Trash2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { fetchAssets } from "@/data/api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function formatBytes(bytes: number) {
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  return `${(bytes / 1000).toFixed(0)} KB`;
}

export default function AssetsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchAssets().then(a => { if (mounted) setAssets(a ?? []); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Assets</h1>
          <p className="text-slate-500 mt-1">{assets.length} files uploaded</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white/[0.04] rounded-lg p-1 gap-1">
            {([["grid", Grid], ["list", List]] as const).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn("p-1.5 rounded transition-all", view === v ? "bg-violet-500/20 text-violet-300" : "text-slate-500 hover:text-white")}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm">
            <Upload size={14} /> Upload
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {assets.map((asset, i) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl overflow-hidden bg-[#0f0f1a] border border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center text-white">
                    <Download size={13} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-red-500/40 backdrop-blur flex items-center justify-center text-white">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-white text-xs font-medium truncate">{asset.name}</p>
                <p className="text-slate-600 text-xs">{formatBytes(asset.size)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((asset, i) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-[#0f0f1a] border border-white/[0.06] hover:border-white/[0.10] transition-all group"
            >
              <img src={asset.url} alt={asset.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                <p className="text-slate-500 text-xs">{asset.dimensions?.width}×{asset.dimensions?.height} · {formatBytes(asset.size)}</p>
              </div>
              <p className="text-slate-600 text-xs hidden sm:block">{new Date(asset.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white transition-colors"><Download size={13} /></button>
                <button className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={13} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
