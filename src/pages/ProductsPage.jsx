import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CircleCheck,
  Sparkles,
  Layers,
  Heart,
  ArrowRight,
  Package,
  Info,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  useEffect(() => {
    document.title = "Products & Services | Araina - Feminine Wellness";
  }, []);

  const [activeTab, setActiveTab] = useState("features");

  const layersList = [
    {
      num: "Layer 1",
      title: "Ultra-Soft Top Layer",
      desc: "Gentle on skin, designed to quickly absorb moisture while remaining soft and dry.",
    },
    {
      num: "Layer 2",
      title: "Flow Distribution Sheet",
      desc: "Evenly distributes fluid across the pad to prevent pooling or localized leakage.",
    },
    {
      num: "Layer 3",
      title: "Air-Laid Paper Core",
      desc: "Provides structural integrity and rapid absorption support.",
    },
    {
      num: "Layer 4",
      title: "Super Absorbent Polymer (SAP)",
      desc: "Locks in fluid efficiently, preventing reverse re-wetting.",
    },
    {
      num: "Layer 5",
      title: "High-Density Cushioning",
      desc: "Adds comfort and retains pad shape during movement.",
    },
    {
      num: "Layer 6",
      title: "Secondary Lock Paper",
      desc: "Ensures secondary absorption for heavy flow security.",
    },
    {
      num: "Layer 7",
      title: "Breathable Backing Film",
      desc: "Allows micro-air circulation while blocking liquid leakage.",
    },
    {
      num: "Layer 8",
      title: "Release Paper & Adhesive",
      desc: "Food-grade adhesive wings ensuring firm grip without residue on undergarments.",
    },
  ];

  const features = [
    {
      title: "8-Layer Protection",
      desc: "Engineered multi-layer absorption designed for maximum security and peace of mind.",
    },
    {
      title: "Touch-Free Manufacturing",
      desc: "Produced in clean, automated hygienic facilities adhering to strict safety protocols.",
    },
    {
      title: "Skin Comfort & Softness",
      desc: "Selected materials aimed at minimizing friction, chafing, and skin irritation.",
    },
    {
      title: "Breathable Airflow System",
      desc: "Helps keep moisture levels balanced for day-long freshness.",
    },
    {
      title: "Ergonomic Winged Design",
      desc: "Stays securely in place during sports, work, travel, and sleep.",
    },
    {
      title: "Odor Neutralizing Care",
      desc: "Natural moisture-lock system that maintains fresh confidence without harsh artificial perfumes.",
    },
  ];

  const useCases = [
    {
      title: "Daywear & Active Days",
      desc: "Flexible, slim fit for work, college, errands, and physical movement.",
    },
    {
      title: "Heavy Flow & Overnight Care",
      desc: "Extra coverage and absorption locking fluid safely during extended sleep hours.",
    },
    {
      title: "Sensitive Skin Care",
      desc: "Soft top surface designed to feel gentle and smooth against skin.",
    },
  ];

  const productFeatureImages = [
    {
      title: "Ultra-Thin & Highly Absorbent",
      src: "/assets/images/Ultra Thin & Highly absorbent.png",
    },
    {
      title: "Quick Absorption",
      src: "/assets/images/quick absorption.png",
    },
    {
      title: "Moisture Lock Dry Feel",
      src: "/assets/images/moisture lock dry feel.png",
    },
    { title: "Odour Free", src: "/assets/images/odour free.png" },
    {
      title: "Premium Quality",
      src: "/assets/images/premium quality (1).png",
    },
  ];

  return (
    <div className="pt-0 pb-20 min-h-screen bg-araina-white text-araina-black">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-40 pb-16 lg:pt-48 lg:pb-24 bg-gradient-to-tr from-araina-white via-araina-pink/5 to-araina-blue/5 overflow-hidden border-b border-araina-pink/10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-araina-pink bg-araina-pink/10 px-4 py-2 rounded-full mb-6">
                Designed With Care
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
                Care Designed <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-araina-pink to-araina-blue">
                  For Her Every Day.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-araina-black/75 font-light leading-relaxed mb-8 max-w-2xl">
                Araina represents a promise to stand beside women throughout
                their menstrual journeys. We focus on delivering high-quality,
                reliable hygiene products without exaggerated claims or
                fear-based messaging. Just straightforward quality, comfort, and
                care designed around women's wellness needs.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="bg-araina-pink hover:bg-araina-pink/90 text-araina-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all shadow-md shadow-araina-pink/20 flex items-center gap-2"
                >
                  Inquire / Order Details <ArrowRight size={14} />
                </Link>
                <a
                  href="#protection-system"
                  className="border border-araina-black/20 hover:border-araina-pink hover:text-araina-pink text-araina-black text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all"
                >
                  8-Layer Protection
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative max-w-[400px] w-full bg-gradient-to-br from-araina-pink/5 to-araina-blue/5 border border-araina-pink/15 rounded-3xl p-8 shadow-lg"
              >
                <img
                  src="/assets/product/araina-product.png"
                  alt="Araina Sanitary Pad Package Showcase"
                  className="w-full h-auto object-contain rounded-2xl shadow-md border border-white/80 hover:scale-105 transition-transform duration-500"
                />
                <div className="mt-4 p-3 bg-araina-white/90 rounded-xl border border-araina-pink/10 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-araina-pink block">
                    Flagship Hygiene Product
                  </span>
                  <span className="text-xs text-araina-black/70 font-light">
                    Araina Premium Sanitary Pads
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCT HIGHLIGHTS & LIFESTYLE ==================== */}
      <section className="py-20 bg-araina-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-araina-pink/10 shadow-md">
                <img
                  src="/assets/images/araina_product_lifestyle.png"
                  alt="Araina Organic Comfort & Wellness Lifestyle"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue block mb-4">
                Product Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                Pure Comfort & Hygienic Excellence
              </h2>
              <p className="text-sm sm:text-base text-araina-black/75 font-light leading-relaxed mb-6">
                Every detail of the Araina sanitary pad is crafted with respect
                for women's bodies and skin sensitivity. We combine modern
                absorbency technology with clean manufacturing standards to
                deliver a product that feels soft, stays dry, and empowers women
                to move freely without hesitation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.slice(0, 4).map((f, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-araina-pink/5 rounded-2xl border border-araina-pink/10"
                  >
                    <h4 className="text-xs font-bold text-araina-black mb-1">
                      {f.title}
                    </h4>
                    <p className="text-[11px] text-araina-black/60 font-light">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 8-LAYER PROTECTION SYSTEM ==================== */}
      <section
        id="protection-system"
        className="py-20 bg-gradient-to-b from-araina-white to-araina-pink/5 border-t border-araina-pink/10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
              Advanced Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              The 8-Layer Protection System
            </h2>
            <p className="text-sm text-araina-black/60 font-light">
              A breakdown of the internal layers designed to offer absorbency,
              softness, breathability, and structural safety.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <img
                src="/assets/images/pad image.png"
                alt="Illustration of the sanitary pad's protective layers"
                className="w-full max-w-sm max-h-[520px] object-contain"
              />
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {layersList.map((layer, idx) => (
                <div
                  key={idx}
                  className="bg-araina-white border border-araina-pink/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-araina-pink/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-araina-pink bg-araina-pink/10 px-3 py-1 rounded-full">
                      {layer.num}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-araina-black mb-2">
                    {layer.title}
                  </h4>
                  <p className="text-xs text-araina-black/65 font-light leading-relaxed">
                    {layer.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-araina-pink/10 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight mb-10">
            Product's Features
          </h2>
          <div className="overflow-hidden">
            <div className="product-feature-marquee flex w-max">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 gap-8 pr-8"
                >
                  {productFeatureImages.map((feature) => (
                    <figure
                      key={feature.title}
                      className="flex w-40 shrink-0 flex-col items-center text-center sm:w-48"
                    >
                      <img
                        src={feature.src}
                        alt=""
                        className="mb-3 h-28 w-40 object-contain sm:h-32 sm:w-48"
                      />
                      <figcaption className="text-xs font-semibold text-araina-black/75">
                        {feature.title}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SUITABLE USE CASES & SPECS STRUCTURE ==================== */}
      <section className="py-20 bg-araina-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue block mb-4">
                Usage Guidelines
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
                Suitable Use Cases
              </h2>
              <div className="space-y-4">
                {useCases.map((uc, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-gradient-to-r from-araina-pink/5 to-transparent border border-araina-pink/10 rounded-2xl"
                  >
                    <h4 className="text-sm font-bold text-araina-black mb-1">
                      {uc.title}
                    </h4>
                    <p className="text-xs text-araina-black/70 font-light">
                      {uc.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
                Product Details
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
                Specifications Overview
              </h2>

              <div className="bg-araina-white border border-araina-pink/15 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-araina-pink/5 border-b border-araina-pink/10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-araina-black">
                    General Product Information
                  </span>
                  <Info size={16} className="text-araina-pink" />
                </div>
                <div className="divide-y divide-araina-pink/10 text-xs">
                  <div className="p-4 flex justify-between">
                    <span className="font-semibold text-araina-black/70">
                      Brand Name
                    </span>
                    <span className="font-light text-araina-black">ARAINA</span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="font-semibold text-araina-black/70">
                      Marketing Company
                    </span>
                    <span className="font-light text-araina-black">
                      Royo Essentials LLP
                    </span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="font-semibold text-araina-black/70">
                      Category
                    </span>
                    <span className="font-light text-araina-black">
                      Feminine Hygiene & Wellness
                    </span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="font-semibold text-araina-black/70">
                      Protection Architecture
                    </span>
                    <span className="font-light text-araina-black">
                      8-Layer Absorbency System
                    </span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="font-semibold text-araina-black/70">
                      Manufacturing Method
                    </span>
                    <span className="font-light text-araina-black">
                      Touch-Free Automated Process
                    </span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="font-semibold text-araina-black/70">
                      Packaging Variants
                    </span>
                    <span className="font-light text-araina-black">
                      Standard & Heavy Flow Packs
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 mx-auto mt-2 grid w-full max-w-4xl grid-cols-3 items-center justify-items-center gap-6 border-t border-araina-pink/10 pt-8 lg:col-span-12">
              <img
                src="/assets/images/ISI mark.png"
                alt="ISI mark"
                className="h-20 w-full max-w-48 object-contain opacity-85"
              />
              <img
                src="/assets/images/iso certified.png"
                alt="ISO certified"
                className="h-20 w-full max-w-48 object-contain opacity-85"
              />
              <img
                src="/assets/images/non toxic.png"
                alt="Non-toxic materials"
                className="h-20 w-full max-w-48 object-contain opacity-85"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="no-butterfly-background py-16 bg-gradient-to-r from-araina-pink via-araina-pink/90 to-araina-blue/90 text-araina-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Interested in Araina Products or Distribution?
          </h2>
          <p className="text-sm text-white/90 font-light max-w-xl mx-auto mb-8">
            Contact our team to get detailed product information, bulk inquiry
            details, or distribution opportunities.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-araina-white text-araina-black hover:bg-araina-black hover:text-araina-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all shadow-lg"
          >
            Contact Product Team
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
