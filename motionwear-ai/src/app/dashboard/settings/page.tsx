"use client";
import { useEffect, useState } from "react";
import { User, Building2, Bell, CreditCard, Key, Copy, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchUser } from "@/data/api";
import { cn } from "@/lib/utils";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API Keys", icon: Key },
];

const notificationSettings = [
  { id: "video-done", label: "Video Generated", desc: "When your video is ready" },
  { id: "credits-low", label: "Credits Low", desc: "When credits fall below 50" },
  { id: "newsletter", label: "Newsletter", desc: "Monthly product updates" },
  { id: "billing", label: "Billing Alerts", desc: "Payment confirmations" },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    "video-done": true, "credits-low": true, "newsletter": false, "billing": true
  });

  const [user, setUser] = useState<any | null>(null);
  const apiKey = "sk_live_mw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  useEffect(() => { fetchUser().then(u => setUser(u)).catch(() => {}); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <nav className="sm:w-48 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeSection === id
                  ? "bg-violet-500/10 text-white border border-violet-500/20"
                  : "text-slate-500 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0f0f1a] border border-white/[0.06] rounded-2xl p-6 space-y-6"
          >
            {activeSection === "profile" && (
              <>
                <h2 className="text-white font-semibold">Profile Settings</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {user?.name?.charAt(0) ?? '?'}
                  </div>
                  <Button variant="secondary" size="sm">Change Photo</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={user?.name} />
                  <Input label="Email" defaultValue={user?.email} type="email" />
                  <Input label="Company" defaultValue="MotionWear Studio" />
                  <Input label="Website" defaultValue="https://studio.example.com" />
                </div>
                <Button variant="primary" size="sm">Save Changes</Button>
              </>
            )}

            {activeSection === "company" && (
              <>
                <h2 className="text-white font-semibold">Company Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Company Name" defaultValue="MotionWear Studio" />
                  <Input label="Industry" defaultValue="Fashion & E-commerce" />
                  <Input label="Tax ID" placeholder="VAT / EIN number" />
                  <Input label="Country" defaultValue="France" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 font-medium mb-1.5">Billing Address</label>
                  <textarea
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-all"
                    rows={3}
                    defaultValue="123 Rue de Rivoli&#10;75001 Paris, France"
                  />
                </div>
                <Button variant="primary" size="sm">Save Changes</Button>
              </>
            )}

            {activeSection === "notifications" && (
              <>
                <h2 className="text-white font-semibold">Notification Preferences</h2>
                <div className="space-y-4">
                  {notificationSettings.map(n => (
                    <div key={n.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div>
                        <p className="text-white text-sm font-medium">{n.label}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{n.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [n.id]: !prev[n.id as keyof typeof prev] }))}
                        className={cn(
                          "w-10 h-5.5 rounded-full transition-all duration-300 relative flex-shrink-0",
                          notifications[n.id as keyof typeof notifications] ? "bg-violet-500" : "bg-white/10"
                        )}
                        style={{ height: "22px", width: "40px" }}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white absolute top-[3px] transition-all duration-300",
                          notifications[n.id as keyof typeof notifications] ? "left-[20px]" : "left-[3px]"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeSection === "api" && (
              <>
                <h2 className="text-white font-semibold">API Keys</h2>
                <p className="text-slate-500 text-sm">Use these keys to access the MotionWear API programmatically.</p>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">Production Key</p>
                      <p className="text-slate-500 text-xs mt-0.5">Created May 15, 2025</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(apiKey)}
                        className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white transition-colors"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white transition-colors"
                      >
                        {showApiKey ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-slate-400 bg-black/30 rounded-lg px-3 py-2 break-all">
                    {showApiKey ? apiKey : "sk_live_mw_" + "•".repeat(40)}
                  </div>
                </div>
                <Button variant="secondary" size="sm">Generate New Key</Button>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <p className="text-amber-400 text-xs font-medium mb-1">⚠️ Keep your API key secret</p>
                  <p className="text-slate-500 text-xs">Never expose your API key in client-side code or public repositories.</p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
