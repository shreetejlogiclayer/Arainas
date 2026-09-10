import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Shield, Compass } from "lucide-react";

const WhyAraina = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const pillars = [
    {
      title: "Comfort",
      description:
        "Thoughtfully positioned menstrual care designed around women's needs, offering premium softness and breathability.",
      icon: Heart,
    },
    {
      title: "Hygiene",
      description:
        "A focus on safe, responsible menstrual care with strict quality standards and touch-free manufacturing practices.",
      icon: Shield,
    },
    {
      title: "Confidence",
      description:
        "Helping women experience their periods with confidence and comfort, rather than compromise or limitations.",
      icon: Sparkles,
    },
    {
      title: "Empowerment",
      description:
        "Connecting women's health with entrepreneurship, learning, and meaningful financial opportunities to rise.",
      icon: Compass,
    },
  ];

  return (
    <section
      id="why-araina"
      className="py-24 bg-gradient-to-b from-araina-white to-araina-pink/5 relative overflow-hidden butterfly-background section-divider"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
            Caring Differently
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-araina-black tracking-tight mb-6">
            Why Araina?
          </h2>
          <p className="text-sm sm:text-base text-araina-black/60 font-light">
            We believe a woman deserves more than just a product. She deserves
            care that respects her dignity, knowledge that empowers her, and
            choices that support her wellness.
          </p>
        </div>

        {/* Pillars Layout - Asymmetrical and highly interactive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative bg-araina-white border border-araina-pink/10 rounded-2xl p-8 transition-all duration-500 overflow-hidden cursor-pointer ${
                  hoveredIdx === idx
                    ? "shadow-lg border-araina-pink/30 -translate-y-2"
                    : "shadow-sm"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                {/* Background soft color blob on hover */}
                <div
                  className={`absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-tr from-araina-pink/10 to-araina-blue/5 rounded-full transition-transform duration-700 ${
                    hoveredIdx === idx ? "scale-[3]" : "scale-100"
                  } -z-0`}
                />

                <div className="relative z-10">
                  {/* Icon Container */}
                  <div
                    className={`inline-flex p-4 rounded-xl mb-6 transition-all duration-500 ${
                      hoveredIdx === idx
                        ? "bg-araina-pink text-araina-white rotate-6 scale-110"
                        : "bg-araina-pink/10 text-araina-pink"
                    }`}
                  >
                    <Icon
                      size={22}
                      className="transition-transform duration-500"
                    />
                  </div>

                  <h3
                    className={`text-lg font-bold tracking-wide mb-4 transition-colors duration-300 ${
                      hoveredIdx === idx
                        ? "text-araina-pink"
                        : "text-araina-black"
                    }`}
                  >
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-araina-black/60 font-light leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Animated thin accent line at the bottom */}
                  <div className="mt-6 w-full h-[1px] bg-araina-pink/10 overflow-hidden">
                    <div
                      className={`h-full bg-araina-pink transition-transform duration-500 origin-left ${
                        hoveredIdx === idx
                          ? "translate-x-0"
                          : "-translate-x-full"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyAraina;
