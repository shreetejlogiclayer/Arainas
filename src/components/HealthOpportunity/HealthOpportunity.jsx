import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  HeartPulse,
  House,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const HealthOpportunity = () => {
  const steps = [
    {
      title: "Better Health",
      desc: "Quality feminine care and menstrual hygiene awareness as the essential foundation.",
      icon: HeartPulse,
    },
    {
      title: "Greater Confidence",
      desc: "Approaching everyday life and choices with comfort, free from fear or limitations.",
      icon: Sparkles,
    },
    {
      title: "Meaningful Opportunity",
      desc: "Flexible business platforms that allow women to learn and grow at their own pace.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Financial Independence",
      desc: "Developing skills, earning with dignity, and taking control of their own futures.",
      icon: TrendingUp,
    },
    {
      title: "Stronger Families",
      desc: "When a woman is empowered, she strengthens her household and sets a new example.",
      icon: House,
    },
    {
      title: "Stronger Communities",
      desc: "Progress that inspires others, turning individual growth into collective upliftment.",
      icon: UsersRound,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="opportunity-flow"
      className="py-24 bg-gradient-to-t from-araina-white to-araina-blue/5 relative overflow-hidden butterfly-background section-divider"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue block mb-4">
            Ecosystem of Rise
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-araina-black tracking-tight mb-6">
            Health Meets Opportunity
          </h2>
          <p className="text-sm sm:text-base text-araina-black/60 font-light">
            We see women's wellness and women's financial growth as a single
            connected path. When one woman rises, she lifts everyone around her.
          </p>
        </div>

        {/* Steps Flow Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group flex h-full items-start gap-4 rounded-2xl border border-araina-pink/10 bg-white/80 p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-araina-pink/25 hover:shadow-lg hover:shadow-araina-pink/5 sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-araina-pink/10 text-araina-pink transition-colors group-hover:bg-araina-pink group-hover:text-white">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <div>
                  <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-araina-blue">
                    Step 0{idx + 1}
                  </span>
                  <h3 className="mb-2 text-sm font-bold text-araina-black transition-colors group-hover:text-araina-pink">
                    {step.title}
                  </h3>
                  <p className="text-xs font-light leading-relaxed text-araina-black/65">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            to="/womens-health"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-araina-blue/25 bg-white/80 px-6 text-[10px] font-bold uppercase tracking-widest text-araina-blue transition hover:border-araina-pink hover:text-araina-pink"
          >
            Women&apos;s health <ArrowRight size={14} />
          </Link>
          <Link
            to="/opportunity"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-araina-pink px-6 text-[10px] font-bold uppercase tracking-widest text-white shadow-md shadow-araina-pink/15 transition hover:-translate-y-0.5 hover:bg-araina-pink/90"
          >
            Women&apos;s opportunity <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HealthOpportunity;
