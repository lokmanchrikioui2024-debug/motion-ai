"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Zap, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget as HTMLFormElement);
      const email = form.get('email') as string;
      const password = form.get('password') as string;
      const api = (await import('@/data/api')).default;
      await api.login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      alert('Login failed: ' + (err?.body?.detail || err?.toString()));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh-purple" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>MotionWear AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Welcome back</h1>
          <p className="text-slate-500">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f1a] border border-white/[0.07] rounded-2xl p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="alex@brand.com"
              icon={<Mail size={14} />}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm text-slate-400 font-medium">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={14} />
                </div>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded accent-violet-500" />
                <span className="text-slate-400 text-sm">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button variant="primary" className="w-full" loading={loading} type="submit">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <div className="grid grid-cols-2 gap-3">
              {["Google", "GitHub"].map(provider => (
                <button key={provider} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-slate-300 text-sm hover:bg-white/[0.04] transition-all">
                  {provider}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
