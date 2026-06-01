"use client";
import { useState } from "react";
import Link from "next/link";
import { Zap, User, Mail, Lock, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget as HTMLFormElement);
      const email = form.get('email') as string;
      const password = form.get('password') as string;
      const api = (await import('@/data/api')).default;
      await api.register(email, password);
      // auto-login after register
      await api.login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      alert('Registration failed: ' + (err?.body?.detail || err?.toString()));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-purple" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>MotionWear AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Start for free</h1>
          <p className="text-slate-500">Create your account today</p>
        </div>

        <div className="bg-[#0f0f1a] border border-white/[0.07] rounded-2xl p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" placeholder="Alex" icon={<User size={14} />} required />
              <Input label="Last Name" placeholder="Moreau" required />
            </div>
            <Input name="email" label="Email" type="email" placeholder="alex@brand.com" icon={<Mail size={14} />} required />
            <Input label="Company (Optional)" placeholder="Your Brand Name" icon={<Building2 size={14} />} />
            <Input name="password" label="Password" type="password" placeholder="Min. 8 characters" icon={<Lock size={14} />} required />

            <label className="flex items-start gap-2 cursor-pointer mt-2">
              <input type="checkbox" className="mt-0.5 rounded accent-violet-500" required />
              <span className="text-slate-400 text-xs">
                I agree to the{" "}
                <span className="text-violet-400">Terms of Service</span> and{" "}
                <span className="text-violet-400">Privacy Policy</span>
              </span>
            </label>

            <Button variant="primary" className="w-full" loading={loading} type="submit">
              Create Free Account
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-emerald-400 text-xs text-center">✓ Free plan includes 5 videos/month — no credit card required</p>
          </div>
        </div>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
