"use client";
import { useEffect, useState } from "react";
import { Video, Clock, DollarSign, Zap, ArrowRight, Play, Plus } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fetchChartData, fetchProjects, fetchUser } from "@/data/api";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Link from "next/link";
import { motion } from "framer-motion";

const defaultStats = [
  { label: "Videos Created", value: 0, change: 0, format: "number" as const, icon: <Video size={18} />, gradient: "bg-violet-500/10" },
  { label: "Time Saved", value: 0, change: 0, format: "number" as const, icon: <Clock size={18} />, gradient: "bg-blue-500/10" },
  { label: "Revenue Impact", value: 0, change: 0, format: "currency" as const, icon: <DollarSign size={18} />, gradient: "bg-emerald-500/10" },
  { label: "Credits Left", value: 0, change: 0, format: "number" as const, icon: <Zap size={18} />, gradient: "bg-amber-500/10" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f1a] border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-white text-xs font-medium" style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchProjects().then(p => { if (mounted) setProjects(p ?? []); }).catch(() => {});
    fetchUser().then(u => { if (mounted) setUser(u); }).catch(() => {});
    fetchChartData().then(c => { if (mounted) setChartData(c ?? []); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const recentProjects = projects.slice(0, 4);

  const stats = defaultStats.map(s => ({ ...s }));
  if (user) stats[3].value = user.credits ?? 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Good morning, {(user?.name ?? 'User').split(" ")[0]} 👋
            </h1>
            <p className="text-slate-500 mt-1">Here's what's happening with your campaigns</p>
          </div>
          <Link href="/dashboard/generate">
            <Button variant="primary" size="md">
              <Plus size={16} /> New Video
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>Video Performance</h3>
              <p className="text-slate-500 text-sm mt-0.5">Monthly videos & views</p>
            </div>
            <Badge variant="success">+32% this year</Badge>
          </div>
            <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData.length ? chartData : []}>
              <defs>
                <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="videos" name="Videos" stroke="#8b5cf6" fill="url(#purple)" strokeWidth={2} />
              <Area type="monotone" dataKey="conversions" name="Conversions" stroke="#3b82f6" fill="url(#blue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-white font-semibold mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: "Generate Video", desc: "Upload garment & create", href: "/dashboard/generate", color: "from-violet-500/10 to-blue-500/10 border-violet-500/20" },
              { label: "Browse Templates", desc: "Explore 50+ styles", href: "/dashboard/templates", color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20" },
              { label: "View Analytics", desc: "Track performance", href: "/dashboard/analytics", color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20" },
            ].map(item => (
              <Link key={item.href} href={item.href}>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} border hover:opacity-80 transition-opacity flex items-center justify-between group`}>
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-violet-400" />
              <span className="text-white text-xs font-semibold">Credits Usage</span>
            </div>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-2xl font-bold text-white">{user?.credits ?? 0}</span>
              <span className="text-slate-500 text-sm mb-0.5">/ 1000</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" style={{ width: `${((user?.credits ?? 0) / 1000) * 100}%` }} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>Recent Projects</h2>
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm">View all <ArrowRight size={14} /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProjects.map(project => (
            <div key={project.id} className="rounded-2xl overflow-hidden bg-[#0f0f1a] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group">
              <div className="relative h-40 overflow-hidden">
                <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 right-2">
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
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play size={16} className="text-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-medium truncate">{project.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{project.format} · {project.duration}s</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
