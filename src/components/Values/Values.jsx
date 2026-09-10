import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Values = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const valuesList = [
    {
      num: "01",
      title: "Integrity & Honesty",
      desc: "We believe trust begins with doing the right thing and communicating honestly.",
    },
    {
      num: "02",
      title: "Women's Health First",
      desc: "Women's well-being remains at the heart of our purpose and our work.",
    },
    {
      num: "03",
      title: "Uncompromising Quality",
      desc: "We believe women deserve thoughtful, quality-focused products and experiences.",
    },
    {
      num: "04",
      title: "Trust & Transparency",
      desc: "We value openness, clarity, accountability, and relationships built for the long term.",
    },
    {
      num: "05",
      title: "Empowerment Through Opportunity",
      desc: "We believe meaningful opportunities can help women develop confidence, skills, independence, and a stronger sense of possibility.",
    },
    {
      num: "06",
      title: "Respect & Dignity",
      desc: "Every woman deserves to be treated with respect, understanding, and dignity.",
    },
    {
      num: "07",
      title: "Courage & Perseverance",
      desc: "Building something meaningful requires the courage to begin and the perseverance to continue.",
    },
    {
      num: "08",
      title: "Continuous Learning & Improvement",
      desc: "We believe growth comes from remaining curious, learning continuously, listening, and improving.",
    },
    {
      num: "09",
      title: "Responsibility",
      desc: "We take responsibility for our actions, our communication, our commitments, and the impact we aim to create.",
    },
    {
      num: "10",
      title: "Community & Collective Growth",
      desc: "We believe progress becomes more powerful when people support one another and grow together. When women support women, everyone rises.",
    },
  ];

  return (
    <section
      id="values"
      className="py-24 bg-gradient-to-b from-araina-white to-araina-pink/5 relative overflow-hidden butterfly-background section-divider"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
            Our Core Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-araina-black tracking-tight mb-6">
            Our Values
          </h2>
          <p className="text-sm sm:text-base text-araina-black/60 font-light">
            The principles that guide how we build our company, serve women,
            make decisions, and grow.
          </p>
        </div>

        {/* Sophisticated Vertical List Expansion Layout */}
        <div className="flex flex-col border-t border-araina-pink/10">
          {valuesList.map((val, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={idx}
                className="border-b border-araina-pink/10 relative transition-all duration-300"
                onMouseEnter={() => setActiveIdx(idx)}
              >
                {/* Background glow on active */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-araina-pink/5 to-transparent transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="relative z-10 px-4 py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between cursor-pointer">
                  {/* Left block: Number + Title */}
                  <div className="flex items-center gap-6">
                    <span
                      className={`text-sm sm:text-lg font-bold transition-all duration-300 ${
                        isActive
                          ? "text-araina-pink scale-110"
                          : "text-araina-black/40"
                      }`}
                    >
                      {val.num}
                    </span>
                    <h3
                      className={`text-lg sm:text-xl font-bold tracking-wide transition-colors duration-300 ${
                        isActive ? "text-araina-pink" : "text-araina-black/80"
                      }`}
                    >
                      {val.title}
                    </h3>
                  </div>

                  {/* Right block: Expandable Description */}
                  <div className="mt-2 md:mt-0 md:max-w-xl w-full flex justify-end">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-xs sm:text-sm text-araina-black/70 font-light leading-relaxed text-left w-full md:text-right"
                        >
                          {val.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Values;
