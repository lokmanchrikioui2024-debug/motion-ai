"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Wand2, FolderOpen, LayoutTemplate,
  ImageIcon, BarChart3, CreditCard, Settings,
  Zap, ChevronRight, Sparkles
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/generate", icon: Wand2, label: "Generate Video", accent: true },
  { href: "/dashboard/projects", icon: FolderOpen, label: "Projects" },
  { href: "/dashboard/templates", icon: LayoutTemplate, label: "Templates" },
  { href: "/dashboard/assets", icon: ImageIcon, label: "Assets" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#070710] border-r border-white/[0.05] flex flex-col z-30">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.05]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            MotionWear
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, accent }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-violet-500/10 text-white border border-violet-500/20"
                  : "text-slate-500 hover:text-white hover:bg-white/[0.04]",
                accent && !isActive && "text-violet-400 hover:text-violet-300"
              )}
            >
              <Icon size={18} className={cn(
                "transition-transform group-hover:scale-110",
                isActive ? "text-violet-400" : ""
              )} />
              <span className="flex-1">{label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      <div className="p-4">
        <div className="rounded-xl p-4 bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-white text-xs font-semibold">Upgrade to Business</span>
          </div>
          <p className="text-slate-500 text-xs mb-3">Unlock API access, unlimited videos & team collaboration.</p>
          <Link
            href="/dashboard/billing"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Upgrade Now <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
