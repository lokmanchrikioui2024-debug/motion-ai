"use client";
import { useEffect, useState } from "react";
import { Bell, Zap, ChevronDown } from "lucide-react";
import { fetchUser, fetchNotifications } from "@/data/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchUser().then(u => { if (mounted) setUser(u); }).catch(() => {});
    fetchNotifications().then(n => { if (mounted) setNotifications(n); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-white/[0.05] flex items-center px-6 gap-4 bg-[#070710]/80 backdrop-blur-xl sticky top-0 z-20">
      {title && (
        <div className="flex-1">
          <h1 className="text-white font-semibold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h1>
        </div>
      )}
      {!title && <div className="flex-1" />}

      <div className="flex items-center gap-3">
        {/* Credits */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <Zap size={14} className="text-violet-400" />
          <span className="text-violet-300 text-sm font-semibold">{user?.credits ?? '—'}</span>
          <span className="text-violet-500 text-xs">credits</span>
        </div>

        {/* Upgrade */}
        <Button size="sm" variant="primary" className="hidden sm:flex">
          Upgrade
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-[#0f0f1a] border border-white/[0.08] rounded-2xl shadow-xl shadow-black/50 overflow-hidden z-50">
              <div className="p-4 border-b border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${!n.read ? "bg-violet-500/[0.03]" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === "success" ? "bg-emerald-400" :
                        n.type === "warning" ? "bg-amber-400" :
                        n.type === "error" ? "bg-red-400" : "bg-blue-400"
                      }`} />
                      <div>
                        <p className="text-white text-xs font-medium">{n.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User */}
          <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name ? user.name.charAt(0) : '?' }
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-white text-xs font-medium leading-none">{user?.name ?? 'Guest'}</p>
            <p className="text-slate-500 text-xs mt-0.5 capitalize">{user?.plan ?? ''} plan</p>
          </div>
          <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
