import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CircleCheck } from 'lucide-react';

const ProductShowcase = () => {
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

  const productFeatures = [
    'Thoughtfully engineered 8-layer protection system',
    'Designed around everyday comfort and breathability',
    'Safe and responsible menstrual care standard',
    'Created with clean, touch-free manufacturing methods'
  ];

  return (
    <section
      id="product"
      className="py-24 bg-araina-white relative overflow-hidden border-t border-araina-pink/5"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Image Showcase Column */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="relative w-full max-w-[400px] aspect-square flex items-center justify-center bg-gradient-to-br from-araina-pink/5 to-araina-blue/5 rounded-3xl p-8 border border-araina-pink/10 shadow-sm"
            >
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-3xl -z-10" />
              
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                src="/assets/product/araina-product-placeholder.png"
                alt="Araina pad package showcasing elegant details"
                className="max-h-[90%] w-auto object-contain rounded-2xl shadow-lg border border-araina-pink/5"
              />
            </motion.div>
          </div>

          {/* Copy and Specs Column */}
          <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue block mb-4">
                Designed With Care
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-araina-black tracking-tight mb-6">
                Care Designed For Her.
              </h2>
              <p className="text-sm sm:text-base text-araina-black/70 font-light leading-relaxed mb-8">
                Araina represents a promise to stand beside women throughout their menstrual journeys. We focus on delivering high-quality, reliable hygiene products without exaggerated claims or fear-based messaging. Just straightforward quality, comfort, and care designed around women's wellness needs.
              </p>
            </motion.div>

            {/* Visual Checklist */}
            <motion.ul
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 mb-8"
            >
              {productFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-araina-pink mt-1 shrink-0">
                    <CircleCheck size={18} />
                  </span>
                  <span className="text-xs sm:text-sm text-araina-black/85 font-light">
                    {feat}
                  </span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={() => handleScrollTo('join-us')}
                className="bg-araina-black hover:bg-araina-pink text-araina-white hover:text-araina-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-[2px] active:translate-y-0 shadow-md flex items-center gap-2 w-fit"
              >
                Explore Product <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
