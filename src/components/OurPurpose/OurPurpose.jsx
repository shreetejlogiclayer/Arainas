import React from 'react';
import { motion } from 'framer-motion';

const OurPurpose = () => {
  return (
    <section
      id="purpose"
      className="py-32 bg-gradient-to-tr from-araina-pink via-araina-pink/90 to-araina-blue/90 text-araina-white relative overflow-hidden"
    >
      {/* Abstract light blobs */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-0" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-araina-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-araina-blue/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-araina-white/80 bg-white/10 px-4 py-2 rounded-full">
            Our Purpose
          </span>
        </motion.div>

        <div className="space-y-6 sm:space-y-8 font-bold leading-none select-none">
          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
          >
            To care for women.
          </motion.h3>

          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-araina-white/90"
          >
            Create opportunities.
          </motion.h3>

          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-araina-white/70"
          >
            Empower women to rise.
          </motion.h3>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 text-sm sm:text-lg text-araina-white/95 max-w-xl mx-auto font-light leading-relaxed"
        >
          This is the core foundation that guides the products we create, the platform we build, and the community we support.
        </motion.p>
      </div>
    </section>
  );
};

export default OurPurpose;
