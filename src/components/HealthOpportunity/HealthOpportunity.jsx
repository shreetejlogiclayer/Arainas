import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldCheck,
  HeartHandshake,
  Banknote,
  Home,
  Users,
} from "lucide-react";

const HealthOpportunity = () => {
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
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-araina-pink/10 via-araina-blue/10 to-araina-pink/10 pointer-events-none hidden lg:block -translate-y-12" />

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                  {/* Outer animated border rings */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-araina-pink to-araina-blue rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 blur-[2px]" />

                  <div className="relative w-16 h-16 bg-araina-white border border-araina-pink/20 rounded-full flex items-center justify-center text-araina-pink shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:text-araina-blue">
                    <Icon size={24} />

                    {/* Index tag */}
                    <span className="absolute -top-1 -right-1 bg-araina-pink text-araina-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Text Details */}
                <h3 className="text-sm font-bold tracking-wider text-araina-black mb-2 transition-colors duration-300 group-hover:text-araina-pink">
                  {step.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-araina-black/60 leading-relaxed font-light px-2">
                  {step.desc}
                </p>

                {/* Connecting arrow indicator for mobile */}
                {idx < steps.length - 1 && (
                  <div className="w-[1px] h-8 bg-araina-pink/20 my-4 md:hidden" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HealthOpportunity;
