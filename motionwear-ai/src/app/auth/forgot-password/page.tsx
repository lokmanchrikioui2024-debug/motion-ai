"use client";
import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-purple" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>MotionWear AI</span>
          </Link>
        </div>

        <div className="bg-[#0f0f1a] border border-white/[0.07] rounded-2xl p-8 shadow-2xl shadow-black/50">
          {!sent ? (
            <>
              <h1 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Reset your password</h1>
              <p className="text-slate-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" placeholder="alex@brand.com" icon={<Mail size={14} />} required />
                <Button variant="primary" className="w-full" loading={loading}>Send Reset Link</Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <Check size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-white font-semibold text-lg">Email sent!</h2>
              <p className="text-slate-500 text-sm">Check your inbox for the password reset link.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
