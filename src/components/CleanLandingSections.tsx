import React, { useState } from "react";
import { Star } from "lucide-react";

export function PricingSection(): React.ReactElement {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 0,
      cadence: "month",
      bullets: ["50 renders / month", "Basic motions & styles", "Community support"],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 49,
      cadence: "month",
      bullets: ["1,000 renders / month", "All motions & scenes", "Priority email support"],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      cadence: "",
      bullets: ["Unlimited renders", "Dedicated SLAs", "Onboarding & SSO"],
      popular: false,
    },
  ];

  return (
    <section aria-labelledby="pricing-heading" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050508]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "Inter, Poppins, sans-serif" }}>
          Simple, transparent pricing
        </h2>
        <p className="mt-3 text-slate-400 max-w-2xl mx-auto">Start free. Scale as you grow — no hidden fees.</p>

        <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-xl p-6 border ${
                p.popular ? "bg-gradient-to-b from-[#0d0226] to-[#070412] border-purple-600/30 shadow-lg" : "bg-[#0b0b10] border-white/[0.04]"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-400 to-blue-400 text-black text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-white">{p.name}</h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{typeof p.price === "number" ? `$${p.price}` : p.price}</span>
                {p.cadence && <span className="text-sm text-slate-400">/ {p.cadence}</span>}
              </div>

              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  className={`w-full py-2 rounded-md font-semibold ${
                    p.popular ? "bg-gradient-to-r from-violet-400 to-blue-400 text-black" : "bg-white/5 text-white border border-white/[0.04]"
                  }`}
                >
                  {p.price === 0 ? "Start Free" : p.price === "Custom" ? "Contact Sales" : "Choose Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection(): React.ReactElement {
  const testimonials = [
    {
      id: 1,
      name: "Aisha M.",
      role: "Head of Growth, AtelierCo",
      text: "MotionWear turned product images into platform-ready videos in minutes — our TikTok CTR doubled.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&q=60",
      rating: 5,
    },
    {
      id: 2,
      name: "Marco R.",
      role: "E‑commerce Lead, LoomLab",
      text: "The motion styles are realistic and fast. Integration was straightforward and ROI was immediate.",
      avatar: "https://images.unsplash.com/photo-1545996124-1e4920f3a9b5?w=240&h=240&fit=crop&q=60",
      rating: 5,
    },
    {
      id: 3,
      name: "Sofia L.",
      role: "Creative Director, ModeHaus",
      text: "High fidelity results and simple export presets — saved us an entire shoot budget.",
      avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=240&h=240&fit=crop&q=60",
      rating: 5,
    },
  ];

  return (
    <section aria-labelledby="testimonials-heading" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050508]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "Inter, Poppins, sans-serif" }}>
          Loved by forward-thinking brands
        </h2>
        <p className="mt-3 text-slate-400 max-w-2xl mx-auto">Real results from early adopters using MotionWear to scale creative production.</p>

        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="p-6 bg-[#0b0b10] rounded-xl border border-white/[0.04] text-left">
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={`${t.name} avatar`} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white">{t.name}</strong>
                    <span className="text-slate-400 text-sm">— {t.role}</span>
                  </div>
                  <div className="flex items-center mt-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} />
                    ))}
                  </div>
                </div>
              </div>

              <blockquote className="mt-4 text-slate-300 text-sm leading-relaxed">“{t.text}”</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection(): React.ReactElement {
  const faqs = [
    { q: "How long does generation take?", a: "Typical video generation completes within 1–3 minutes depending on complexity and queue." },
    { q: "What formats are supported?", a: "We export MP4, WebM and provide platform presets for TikTok / Instagram / YouTube." },
    { q: "Can I use these videos commercially?", a: "Yes — generated assets include a commercial license for published content." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#050508]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "Inter, Poppins, sans-serif" }}>
          Common questions
        </h2>
        <p className="mt-3 text-slate-400">If your question is not listed, contact support and we’ll help you promptly.</p>

        <div className="mt-8 space-y-3 text-left">
          {faqs.map((f, i) => (
            <div key={i} className="bg-[#0b0b10] rounded-lg border border-white/[0.04] overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between"
                aria-expanded={openIndex === i}
              >
                <span className="text-white font-medium">{f.q}</span>
                <span className="text-slate-400">{openIndex === i ? "−" : "+"}</span>
              </button>

              {openIndex === i && <div className="px-5 pb-4 text-slate-300">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CleanLandingSections(): React.ReactElement {
  return (
    <>
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}
