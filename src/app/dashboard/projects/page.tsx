"use client";
import { useEffect, useState } from "react";
import { Play, Download, Trash2, MoreHorizontal, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { fetchProjects } from "@/data/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Project } from "@/types";

const filters = ["All", "Completed", "Processing", "Pending"];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => { fetchProjects().then(p => setProjects(p ?? [])).catch(() => {}); }, []);

  const filtered = projects.filter(p => {
    const matchesFilter = activeFilter === "All" || p.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Projects</h1>
          <p className="text-slate-500 mt-1">{projects.length} videos generated</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f
                  ? "bg-violet-500/10 text-violet-300 border border-violet-500/30"
                  : "text-slate-500 hover:text-white border border-white/[0.05] hover:border-white/[0.12]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search size={14} />}
            className="h-9 py-2"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl overflow-hidden bg-[#0f0f1a] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge variant={
                  project.status === "completed" ? "success" :
                  project.status === "processing" ? "info" :
                  project.status === "failed" ? "error" : "warning"
                }>
                  {project.status}
                </Badge>
              </div>
              {project.status === "completed" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play size={20} className="text-white ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-violet-500/50 transition-colors">
                  <Download size={13} />
                </button>
                <button className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-red-500/50 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-1 truncate">{project.name}</h3>
              <div className="flex items-center gap-3 text-slate-500 text-xs mb-3">
                <span>{project.format}</span>
                <span>·</span>
                <span>{project.duration}s</span>
                <span>·</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              {project.status === "completed" && (
                <div className="flex items-center gap-4 pt-3 border-t border-white/[0.05]">
                  <div>
                    <p className="text-white text-sm font-semibold">{project.views.toLocaleString()}</p>
                    <p className="text-slate-600 text-xs">Views</p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{project.conversions}</p>
                    <p className="text-slate-600 text-xs">Conversions</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500">No projects match your filters.</p>
        </div>
      )}
    </div>
  );
}
