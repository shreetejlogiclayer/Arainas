import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
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
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-araina-white via-araina-pink/5 to-araina-blue/5"
    >
      {/* Background elegant circles/lines */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-araina-pink/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-araina-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Content Column */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-4"
          >
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-araina-pink bg-araina-pink/10 px-4 py-2 rounded-full">
              Feminine Hygiene & Empowerment
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-araina-black tracking-tight leading-[1.1] mb-6"
          >
            Empowering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-araina-pink to-araina-blue">
              To Rise
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-sm sm:text-base text-araina-black/70 max-w-xl leading-relaxed mb-8 font-light"
          >
            Araina is our flagship feminine hygiene brand, created with a simple purpose—to bring care, awareness, confidence, and opportunity closer to women. Because when a woman takes care of herself, understands her choices, and believes in her potential, she becomes stronger in every part of life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => handleScrollTo('product')}
              className="bg-araina-pink hover:bg-araina-pink/90 text-araina-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-[2px] active:translate-y-0 shadow-md hover:shadow-lg shadow-araina-pink/20 flex items-center justify-center gap-2"
            >
              Discover Araina <ArrowRight size={14} />
            </button>
            <button
              onClick={() => handleScrollTo('purpose')}
              className="border border-araina-black/20 hover:border-araina-pink hover:text-araina-pink text-araina-black text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all duration-300 bg-transparent flex items-center justify-center"
            >
              Our Purpose
            </button>
          </motion.div>
        </div>

        {/* Product Visual Column */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-[380px] sm:max-w-[420px]"
          >
            {/* Soft background shape */}
            <div className="absolute inset-0 bg-gradient-to-tr from-araina-pink/10 to-araina-blue/10 rounded-2xl filter blur-xl transform scale-95 -z-10" />
            
            {/* Floating Container */}
            <div className="animate-float">
              <img
                src="/assets/product/araina-product-placeholder.png"
                alt="Araina Premium sanitary pad packaging placeholder design"
                className="w-full h-auto object-contain rounded-2xl shadow-xl border border-araina-pink/5 hover:shadow-2xl transition-shadow duration-500"
              />
            </div>

            {/* Premium tag overlay */}
            <div className="absolute -bottom-6 -right-4 bg-araina-white border border-araina-pink/10 rounded-xl px-5 py-3 shadow-md backdrop-blur-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-araina-pink animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-araina-black">
                Araina Wellness
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
