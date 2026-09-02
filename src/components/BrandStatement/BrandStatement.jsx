import React from "react";
import { motion } from "framer-motion";

const BrandStatement = () => {
  return (
    <section
      id="about"
      className="py-24 sm:py-32 bg-araina-white relative overflow-hidden"
    >
      {/* Decorative vertical lines */}
      <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-araina-pink/5 hidden md:block" />
      <div className="absolute top-0 bottom-0 right-1/4 w-[1px] bg-araina-pink/5 hidden md:block" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue">
            Our Core Vision
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-araina-black tracking-tight leading-snug mb-10"
        >
          More Than Menstrual Care.
          <br />
          <span className="text-araina-pink font-extrabold">
            A Purpose In Motion.
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6 text-base sm:text-lg text-araina-black/80 font-light max-w-3xl mx-auto leading-relaxed text-justify md:text-center"
        >
          <p>
            At Royo Essentials LLP, we believe that a business becomes truly
            meaningful when it creates value beyond its products. Our purpose
            begins with a simple belief:
          </p>
          <p className="font-medium text-araina-black border-l-2 md:border-l-0 md:border-y border-araina-pink/20 py-4 px-6 md:px-0">
            "When women are healthier, more confident, and given meaningful
            opportunities to grow, they can create stronger futures for
            themselves, their families, and their communities."
          </p>
          <p>
            Royo Essentials LLP is a purpose-driven health, wellness, and
            personal-care company focused on bringing together women's health,
            menstrual wellness, education, entrepreneurship, and empowerment. We
            are building more than a business. We are building a platform where
            care meets opportunity, knowledge meets confidence, and women can
            move forward with purpose.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStatement;
