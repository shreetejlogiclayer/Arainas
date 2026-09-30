import React, { useState } from "react";
import { motion } from "framer-motion";

const Values = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const valuesList = [
    {
      title: "Integrity & Honesty",
      image: "/assets/images/01_Integrity___Honesty-removebg-preview.png",
      desc: "We believe trust begins with doing the right thing and communicating honestly.",
    },
    {
      title: "Women's Health First",
      image: "/assets/images/02_Women_s_Health_First-removebg-preview.png",
      desc: "Women's well-being remains at the heart of our purpose and our work.",
    },
    {
      title: "Uncompromising Quality",
      image: "/assets/images/03_Uncompramising_Quality-removebg-preview.png",
      desc: "We believe women deserve thoughtful, quality-focused products and experiences.",
    },
    {
      title: "Trust & Transparency",
      image: "/assets/images/04_Trust___Transperency-removebg-preview.png",
      desc: "We value openness, clarity, accountability, and relationships built for the long term.",
    },
    {
      title: "Empowerment Through Opportunity",
      image: "/assets/images/Empowerment-removebg-preview.png",
      desc: "We believe meaningful opportunities can help women develop confidence, skills, independence, and a stronger sense of possibility.",
    },
    {
      title: "Respect & Dignity",
      image: "/assets/images/Our_Values-removebg-preview.png",
      desc: "Every woman deserves to be treated with respect, understanding, and dignity.",
    },
    {
      title: "Courage & Perseverance",
      image: "/assets/images/Opportunity_to_Rise-removebg-preview.png",
      desc: "Building something meaningful requires the courage to begin and the perseverance to continue.",
    },
    {
      title: "Continuous Learning & Improvement",
      image: "/assets/images/Quality_Management-removebg-preview.png",
      desc: "We believe growth comes from remaining curious, learning continuously, listening, and improving.",
    },
    {
      title: "Responsibility",
      image: "/assets/images/Our_Commitment-removebg-preview.png",
      desc: "We take responsibility for our actions, our communication, our commitments, and the impact we aim to create.",
    },
    {
      title: "Community & Collective Growth",
      image:
        "/assets/images/10_Community___Collective_Growth-removebg-preview.png",
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {valuesList.map((val, idx) => (
            <motion.article
              key={val.image}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`relative flex h-full flex-col items-center overflow-hidden rounded-2xl border bg-araina-white p-6 text-center transition-all duration-500 ${
                hoveredIdx === idx
                  ? "-translate-y-2 border-araina-pink/30 shadow-lg"
                  : "border-araina-pink/10 shadow-sm"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (idx % 5) * 0.08 }}
            >
              <div
                className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-tr from-araina-pink/10 to-araina-blue/5 transition-transform duration-700 ${
                  hoveredIdx === idx ? "scale-[3]" : "scale-100"
                }`}
              />
              <div className="relative z-10 flex h-full flex-col items-center">
                <img
                  src={val.image}
                  alt=""
                  className={`mb-5 ${idx === 9 ? "h-28 w-28" : "h-36 w-36"} object-contain transition-transform duration-500 ${
                    hoveredIdx === idx ? "rotate-3 scale-110" : ""
                  }`}
                />
                <h3
                  className={`mb-3 text-sm font-bold tracking-wide transition-colors duration-300 ${
                    hoveredIdx === idx
                      ? "text-araina-pink"
                      : "text-araina-black"
                  }`}
                >
                  {val.title}
                </h3>
                <p className="mt-auto text-xs leading-relaxed text-araina-black/70">
                  {val.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
