import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Shield,
  Sparkles,
  Compass,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Banknote,
  Home,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";

const WhyUsPage = () => {
  useEffect(() => {
    document.title = "Why Choose Us | Araina - Caring Differently";
  }, []);

  const pillars = [
    {
      title: "Comfort",
      description:
        "Thoughtfully positioned menstrual care designed around women's needs, offering premium softness, breathability, and ergonomic security.",
      icon: Heart,
      badge: "Ergonomic Design",
    },
    {
      title: "Hygiene",
      description:
        "A focus on safe, responsible menstrual care with strict quality standards and touch-free automated manufacturing practices.",
      icon: Shield,
      badge: "Touch-Free Process",
    },
    {
      title: "Confidence",
      description:
        "Helping women experience their periods with confidence and comfort, rather than compromise, fear, or limitations.",
      icon: Sparkles,
      badge: "Pure Peace of Mind",
    },
    {
      title: "Empowerment",
      description:
        "Connecting women's health with entrepreneurship, learning, and meaningful financial opportunities to rise together.",
      icon: Compass,
      badge: "Ecosystem of Rise",
    },
  ];

  const steps = [
    {
      title: "Better Health",
      desc: "Quality feminine care and menstrual hygiene awareness as the essential foundation.",
      icon: Activity,
    },
    {
      title: "Greater Confidence",
      desc: "Approaching everyday life and choices with comfort, free from fear or limitations.",
      icon: ShieldCheck,
    },
    {
      title: "Meaningful Opportunity",
      desc: "Flexible business platforms that allow women to learn and grow at their own pace.",
      icon: HeartHandshake,
    },
    {
      title: "Financial Independence",
      desc: "Developing skills, earning with dignity, and taking control of their own futures.",
      icon: Banknote,
    },
    {
      title: "Stronger Families",
      desc: "When a woman is empowered, she strengthens her household and sets a new example.",
      icon: Home,
    },
    {
      title: "Stronger Communities",
      desc: "Progress that inspires others, turning individual growth into collective upliftment.",
      icon: Users,
    },
  ];

  const reasons = [
    {
      title: "No Fear-Based Marketing",
      text: "We communicate transparently and respectfully without using fear tactics or exaggerated medical claims.",
    },
    {
      title: "Holistic Approach",
      text: "We look at women health alongside skill development and financial self-reliance.",
    },
    {
      title: "Quality-First Engineering",
      text: "Every pad features an 8-layer absorbency system designed for modern active lifestyles.",
    },
    {
      title: "Dignified Opportunity",
      text: "Flexible pathways for homemakers, career returnees, and women seeking entrepreneurial growth.",
    },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-araina-white text-araina-black">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-tr from-araina-white via-araina-pink/5 to-araina-blue/5 overflow-hidden border-b border-araina-pink/10">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-araina-pink bg-araina-pink/10 px-4 py-2 rounded-full mb-6"
          >
            Caring Differently
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6"
          >
            Why Choose <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-araina-pink to-araina-blue">
              ARAINA?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-araina-black/75 font-light leading-relaxed mb-8"
          >
            We believe a woman deserves more than just a product. She deserves
            care that respects her dignity, knowledge that empowers her, and
            choices that support her wellness.
          </motion.p>
        </div>
      </section>

      {/* ==================== THE 4 CORE PILLARS ==================== */}
      <section className="py-20 bg-araina-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue block mb-4">
              Foundation of Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Our Four Core Pillars
            </h2>
            <p className="text-sm text-araina-black/60 font-light">
              Built to serve women with care, safety, dignity, and opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-araina-white border border-araina-pink/10 hover:border-araina-pink/30 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="inline-flex p-4 rounded-2xl bg-araina-pink/10 text-araina-pink mb-6 group-hover:bg-araina-pink group-hover:text-araina-white transition-all duration-300">
                      <Icon size={24} />
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-araina-blue bg-araina-blue/10 px-2.5 py-1 rounded-full block w-fit mb-3">
                      {p.badge}
                    </span>
                    <h3 className="text-xl font-bold text-araina-black mb-3 group-hover:text-araina-pink transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-araina-black/70 font-light leading-relaxed mb-6">
                      {p.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== ECOSYSTEM OF RISE (6-STEP FLOW) ==================== */}
      <section className="py-20 bg-gradient-to-b from-araina-white via-araina-blue/5 to-araina-white border-t border-araina-pink/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
              Connected Transformation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Health Meets Opportunity
            </h2>
            <p className="text-sm text-araina-black/60 font-light">
              We see women's wellness and women's financial growth as a single
              connected path. When one woman rises, she lifts everyone around
              her.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-araina-white border border-araina-pink/10 rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:border-araina-pink/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-araina-pink/10 to-araina-blue/10 border border-araina-pink/20 flex items-center justify-center text-araina-pink shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-araina-pink block mb-1">
                      Step 0{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-araina-black mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-araina-black/65 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== WHY CUSTOMERS TRUST US ==================== */}
      <section className="py-20 bg-araina-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue block mb-4">
                What Sets Us Apart
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                Why Women & Partners Choose Araina
              </h2>
              <p className="text-sm sm:text-base text-araina-black/75 font-light leading-relaxed mb-8">
                Our approach is rooted in honesty, quality products, transparent
                communication, and genuine empowerment rather than hollow
                marketing gimmicks.
              </p>

              <div className="space-y-4">
                {reasons.map((r, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-araina-pink/5 rounded-2xl border border-araina-pink/10"
                  >
                    <div className="w-6 h-6 rounded-full bg-araina-pink text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-araina-black mb-0.5">
                        {r.title}
                      </h4>
                      <p className="text-xs text-araina-black/70 font-light">
                        {r.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-gradient-to-tr from-araina-pink via-araina-pink/90 to-araina-blue text-araina-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full inline-block mb-6">
                  Empowering To Rise
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-6 leading-tight">
                  "Every woman deserves to experience period care with
                  confidence, dignity, and choice."
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/90 leading-relaxed mb-8">
                  Royo Essentials LLP is committed to creating products and
                  opportunities that build long-term value for women, families,
                  and society.
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-araina-white text-araina-black hover:bg-araina-black hover:text-araina-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all shadow-md"
                >
                  Get In Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 bg-gradient-to-r from-araina-pink via-araina-pink/90 to-araina-blue/90 text-araina-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Experience the Araina Difference?
          </h2>
          <p className="text-sm text-araina-white/70 font-light max-w-xl mx-auto mb-8">
            Explore our product line or connect with our team to learn more.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="bg-araina-white hover:bg-araina-black hover:text-araina-white text-araina-black text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all shadow-md"
            >
              Explore About Product
            </Link>
            <Link
              to="/contact"
              className="border border-araina-white/30 hover:border-araina-white hover:bg-araina-white hover:text-araina-black text-araina-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyUsPage;
