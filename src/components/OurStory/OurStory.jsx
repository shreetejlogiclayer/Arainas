import React from 'react';
import { motion } from 'framer-motion';

const OurStory = () => {
  return (
    <section
      id="our-story"
      className="py-24 bg-araina-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Prominent Question Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-6">
                Our Journey
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-araina-black tracking-tight leading-[1.2] mb-8">
                Why can't women's health and women's financial independence go hand in hand?
              </h2>
              <div className="w-20 h-[3px] bg-gradient-to-r from-araina-pink to-araina-blue rounded-full" />
            </motion.div>
          </div>

          {/* Story Narrative Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-6 text-sm sm:text-base text-araina-black/75 font-light leading-relaxed text-justify"
            >
              <p>
                Our journey began during the pandemic, when we saw how deeply health and financial security can affect women, families, and communities. We saw the importance of health more clearly than ever. At the same time, we saw businesses and jobs disappear and the financial situation of many families become uncertain.
              </p>
              <p>
                These experiences made us look at women's well-being from a broader perspective. A woman needs to take care of her health. She needs access to awareness and informed choices. But she also needs opportunities to build confidence, develop skills, and work towards financial independence. Why should these two needs exist separately?
              </p>
              <p>
                That question became the foundation of our vision. We wanted to bring better care for women's health together with meaningful opportunities for women to learn, grow, and become financially stronger. That led to the creation of Royo India LLP and Araina as our flagship brand.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
