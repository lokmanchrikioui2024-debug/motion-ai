"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap, ArrowRight, Play, Check, Star,
  Upload, Wand2, Download, Brain, Layers, Globe,
  Cpu, Shield, BarChart3, Sparkles, Plus, Minus
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchTestimonials, fetchFaqs, fetchPricingPlans } from "@/data/api";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 lg:px-12 border-b border-white/[0.04] bg-[#050508]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>MotionWear AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-slate-400 text-sm">
          {["Features", "Templates", "Pricing", "FAQ"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
          <Link href="/auth/register"><Button variant="primary" size="sm">Start Free <ArrowRight size={14} /></Button></Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[80px]" />
      </div>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(139,92,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.025) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
            <Sparkles size={13} />
            <span>Powered by Next-Gen Diffusion AI</span>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-6 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="text-white">Transform</span><br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Any Garment</span><br />
            <span className="text-white">Into Viral Video</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload a photo. AI generates a professional model video in minutes. No shoots. No models. No studio. Just extraordinary results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="group">
                Start Free — No Card Required
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <button className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Play size={16} className="ml-0.5" />
                </div>
                Watch Demo
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {["1,200+ brands", "50M+ videos generated", "4.9★ rating", "340% avg. conversion lift"].map(item => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-violet-400" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-16">
          <div className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-violet-500/10">
            <div className="bg-[#0f0f1a] p-3 border-b border-white/[0.06] flex items-center gap-2">
              <div className="flex gap-1.5">
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
              </div>
              <div className="flex-1 bg-white/[0.04] rounded-md h-5 mx-4" />
            </div>
            <div className="grid grid-cols-2 gap-0 bg-[#0a0a12]">
              <div className="relative h-64 border-r border-white/[0.06]">
                <img src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop" alt="Garment" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-center"><Upload size={24} className="text-slate-400 mx-auto mb-2" /><p className="text-slate-400 text-xs">Input Photo</p></div>
                </div>
              </div>
              <div className="relative h-64">
                <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=400&fit=crop" alt="Generated" className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur border border-emerald-500/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-[10px] font-semibold">AI Generated</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#0f0f1a] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center"><Wand2 size={12} className="text-violet-400" /></div>
                <span className="text-slate-400 text-xs">Generation complete</span>
              </div>
              <span className="text-emerald-400 text-xs font-mono">1m 47s</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", icon: Upload, title: "Upload Garment", desc: "Drop any product photo — PNG, JPG, or WEBP. Our AI handles complex textures, patterns, and colors flawlessly." },
    { num: "02", icon: Wand2, title: "AI Does the Magic", desc: "Select your model, motion style, and scene. Our AI generates a professional video in under 2 minutes." },
    { num: "03", icon: Download, title: "Download & Publish", desc: "Get your 4K video ready for TikTok, Instagram, YouTube, or any platform. Full commercial license included." },
  ];

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Three steps to a viral video</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center group">
              <div className="relative mb-6 inline-block">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20 flex items-center justify-center mx-auto group-hover:from-violet-500/20 group-hover:to-blue-500/20 transition-all duration-300">
                  <step.icon size={28} className="text-violet-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0a0a12] border border-violet-500/30 flex items-center justify-center">
                  <span className="text-violet-400 text-xs font-bold">{step.num}</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Brain, title: "Next-Gen AI Model", desc: "Proprietary diffusion architecture trained on 50M+ fashion images for unmatched photorealism." },
    { icon: Layers, title: "Multi-Format Export", desc: "One click to export for TikTok, Instagram, YouTube — all auto-optimized for each platform." },
    { icon: Globe, title: "40+ Languages", desc: "Generate video captions and metadata in 40+ languages for global market reach." },
    { icon: Cpu, title: "API & Integrations", desc: "Automate your workflow with our REST API. Native Shopify and WooCommerce connectors." },
    { icon: Shield, title: "IP Protection", desc: "All content is encrypted at rest and in transit. We never train on your data without consent." },
    { icon: BarChart3, title: "Built-In Analytics", desc: "Track view rates, conversion lifts, and ROI directly from your MotionWear dashboard." },
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent" />
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Everything you need to scale</h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">From solo creators to enterprise fashion houses, MotionWear gives you the infrastructure to transform your content operation.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl bg-[#0f0f1a] border border-white/[0.06] hover:border-violet-500/20 hover:bg-[#131325] transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <feature.icon size={18} className="text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  useEffect(() => { fetchTestimonials().then(t => setTestimonials(t ?? [])).catch(() => {}); }, []);

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Loved by forward-thinking brands</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-[#0f0f1a] border border-white/[0.06] hover:border-white/[0.1] transition-all">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [plans, setPlans] = useState<any[]>([]);
  useEffect(() => { fetchPricingPlans().then(p => setPlans(p ?? [])).catch(() => {}); }, []);

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Simple, transparent pricing</h2>
          <p className="text-slate-500 mt-4">Start free, scale as you grow. No hidden fees.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 border ${plan.popular ? "bg-gradient-to-b from-violet-500/10 to-blue-500/5 border-violet-500/30 shadow-lg shadow-violet-500/10" : "bg-[#0f0f1a] border-white/[0.06]"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-semibold shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-white">${plan.price}</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.slice(0, 5).map((f: string) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={13} className={plan.popular ? "text-violet-400" : "text-emerald-400"} />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/register">
                <Button variant={plan.popular ? "primary" : "secondary"} className="w-full">
                  {plan.price === 0 ? "Start Free" : `Get ${plan.name}`}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  useEffect(() => { fetchFaqs().then(f => setFaqs(f ?? [])).catch(() => {}); }, []);

  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Common questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl bg-[#0f0f1a] border border-white/[0.06] overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors">
                <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                {open === i ? <Minus size={16} className="text-violet-400 flex-shrink-0" /> : <Plus size={16} className="text-slate-500 flex-shrink-0" />}
              </button>
              {open === i && <div className="px-5 pb-5"><p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl p-12 bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative z-10">
            <Sparkles className="text-violet-400 mx-auto mb-4" size={32} />
            <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>Ready to go viral?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join 1,200+ brands already using MotionWear AI to transform their fashion marketing. Start free today.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register"><Button variant="primary" size="lg">Start Free — No Card Required <ArrowRight size={16} /></Button></Link>
              <Link href="/dashboard"><Button variant="secondary" size="lg">View Dashboard Demo</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center"><Zap size={13} className="text-white" /></div>
              <span className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>MotionWear AI</span>
            </div>
            <p className="text-slate-500 text-sm">Transforming fashion marketing with AI-generated video. Trusted by 1,200+ brands worldwide.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            {[
              { title: "Product", links: ["Features", "Templates", "Pricing", "API Docs"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-white font-semibold mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(link => <li key={link}><a href="#" className="text-slate-500 hover:text-white transition-colors">{link}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-sm">© 2025 MotionWear AI. All rights reserved.</p>
          <p className="text-slate-600 text-sm">Built with ❤️ for fashion-forward brands</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-[#050508] overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
