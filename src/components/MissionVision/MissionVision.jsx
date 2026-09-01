import React from 'react';
import { motion } from 'framer-motion';

const MissionVision = () => {
  return (
    <section
      id="mission-vision"
      className="py-24 bg-araina-white relative border-t border-araina-pink/5"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-araina-pink/10">
          
          {/* Mission Column */}
          <div className="pb-12 md:pb-0 md:pr-12 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
                What We Do
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-araina-black tracking-tight mb-6">
                Our Mission
              </h2>
              <p className="text-sm sm:text-base text-araina-black/75 font-light leading-relaxed mb-6">
                To create trusted women's wellness products and meaningful opportunities that help women live healthier, more confident, and financially stronger lives.
              </p>
              <div className="space-y-4 text-xs sm:text-sm text-araina-black/60 font-light leading-relaxed">
                <p>• <strong>Promoting Health:</strong> Developing safe, hygienic, quality-focused feminine wellness and personal-care products.</p>
                <p>• <strong>Creating Opportunity:</strong> Providing a platform through which women can learn, start their own small entrepreneurial journey, and earn with dignity.</p>
                <p>• <strong>Spreading Awareness:</strong> Encouraging open conversations and positive awareness about menstrual health.</p>
              </div>
            </motion.div>
          </div>

          {/* Vision Column */}
          <div className="pt-12 md:pt-0 md:pl-12 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue block mb-4">
                Where We Are Heading
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-araina-black tracking-tight mb-6">
                Our Vision
              </h2>
              <p className="text-sm sm:text-base text-araina-black/75 font-light leading-relaxed mb-6">
                To build a trusted and purpose-driven ecosystem where women's health, confidence, and financial independence grow together.
              </p>
              <p className="text-xs sm:text-sm text-araina-black/60 font-light leading-relaxed mb-4">
                We envision a future where every woman has access to safe and reliable feminine hygiene, understands the importance of her own health, and has the confidence and opportunity to build a financially stronger future without compromising her dignity, health, or family priorities.
              </p>
              <p className="text-xs sm:text-sm font-medium text-araina-blue italic">
                "A future where every woman has the health, confidence, and opportunity to rise."
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MissionVision;
