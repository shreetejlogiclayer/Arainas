import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-araina-white via-araina-pink/5 to-araina-blue/10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
            Empowering To Rise
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-araina-black tracking-tight leading-tight mb-8">
            Every Woman Deserves <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-araina-pink to-araina-blue">
              The Opportunity To Rise.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-araina-black/70 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Araina is where health meets empowerment, confidence meets
            opportunity, and every woman is inspired to rise toward a healthier,
            more confident, and self-dependent future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/about"
              className="inline-flex bg-araina-pink hover:bg-araina-pink/90 text-araina-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-[2px] active:translate-y-0 shadow-md shadow-araina-pink/20 items-center justify-center gap-2 w-full sm:w-auto"
            >
              Discover Araina <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => handleScrollTo("join-us")}
              className="border border-araina-black/20 hover:border-araina-pink hover:text-araina-pink text-araina-black text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all duration-300 bg-araina-white w-full sm:w-auto"
            >
              Join Us — Coming Soon
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
