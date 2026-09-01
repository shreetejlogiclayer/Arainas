import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Compass,
  ArrowRight,
  Target,
  Eye,
  Award,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY_INFO } from "../config/siteConfig";

const AboutPage = () => {
  useEffect(() => {
    document.title = "About Us | Araina - Empowering To Rise";
  }, []);

  const values = [
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
      desc: "We believe meaningful opportunities help women develop confidence, skills, and financial independence.",
    },
    {
      num: "06",
      title: "Respect & Dignity",
      desc: "Every woman deserves to be treated with respect, understanding, and dignity.",
    },
    {
      num: "07",
      title: "Courage & Perseverance",
      desc: "Building something meaningful requires the courage to begin and perseverance to continue.",
    },
    {
      num: "08",
      title: "Continuous Learning",
      desc: "Growth comes from remaining curious, listening, and constantly improving.",
    },
    {
      num: "09",
      title: "Responsibility",
      desc: "We take responsibility for our commitments, actions, and the positive impact we create.",
    },
    {
      num: "10",
      title: "Community & Collective Growth",
      desc: "When women support women, everyone rises.",
    },
  ];

  const commitments = [
    {
      title: "Quality Manufacturing",
      desc: "Crafted with clean, touch-free manufacturing methods ensuring safe, skin-friendly feminine hygiene.",
    },
    {
      title: "Dignity & Respect",
      desc: "Normalizing conversations around menstrual health with dignity and zero fear-based marketing.",
    },
    {
      title: "Entrepreneurial Pathways",
      desc: "Creating accessible, step-by-step learning and income opportunities for women at all stages of life.",
    },
    {
      title: "Long-term Impact",
      desc: "Building a sustainable platform that lifts individuals, households, and entire communities.",
    },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-araina-white text-araina-black">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-tr from-araina-white via-araina-pink/5 to-araina-blue/5 overflow-hidden border-b border-araina-pink/10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-araina-pink/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-araina-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-araina-pink bg-araina-pink/10 px-4 py-2 rounded-full mb-6"
              >
                About Royo India LLP & ARAINA
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6"
              >
                Where Health Meets <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-araina-pink to-araina-blue">
                  Empowerment & Opportunity.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm sm:text-base text-araina-black/75 font-light leading-relaxed mb-8 max-w-2xl"
              >
                {COMPANY_INFO.detailedDescription} We are building more than a
                business. We are building a platform where care meets
                opportunity, knowledge meets confidence, and women can move
                forward with purpose.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/products"
                  className="bg-araina-pink hover:bg-araina-pink/90 text-araina-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-md shadow-araina-pink/20 flex items-center gap-2"
                >
                  Explore About Product <ArrowRight size={14} />
                </Link>
                <Link
                  to="/contact"
                  className="border border-araina-black/20 hover:border-araina-pink hover:text-araina-pink text-araina-black text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all duration-300"
                >
                  Contact Our Team
                </Link>
              </motion.div>
            </div>

            {/* AI Generated Banner Image */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative rounded-3xl overflow-hidden border border-araina-pink/15 shadow-xl group"
              >
                <img
                  src="/assets/images/araina_about_hero.jpg"
                  alt="Empowered confident women representing ARAINA values"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-araina-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-araina-pink bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-2 inline-block">
                    Flagship Brand: ARAINA
                  </span>
                  <p className="text-xs font-light text-white/90">
                    "When a woman takes care of herself and believes in her
                    potential, she becomes stronger in every part of life."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== OUR STORY ==================== */}
      <section className="py-20 bg-araina-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
                Our Story & Origins
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                Why can't women's health and women's financial independence go
                hand in hand?
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-araina-pink to-araina-blue rounded-full mb-8" />

              <div className="space-y-4 text-sm sm:text-base text-araina-black/75 font-light leading-relaxed text-justify">
                <p>
                  Our journey began during the pandemic, when we saw how deeply
                  health and financial security affect women, families, and
                  communities. We saw the importance of health more clearly than
                  ever. At the same time, we saw businesses and jobs disappear
                  and the financial situation of many families become uncertain.
                </p>
                <p>
                  These experiences made us look at women's well-being from a
                  broader perspective. A woman needs to take care of her health.
                  She needs access to awareness and informed choices. But she
                  also needs opportunities to build confidence, develop skills,
                  and work towards financial independence. Why should these two
                  needs exist separately?
                </p>
                <p>
                  That question became the foundation of our vision. We wanted
                  to bring better care for women's health together with
                  meaningful opportunities for women to learn, grow, and become
                  financially stronger. That led to the creation of Royo India
                  LLP and Araina as our flagship brand.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-gradient-to-br from-araina-pink/5 via-araina-white to-araina-blue/5 border border-araina-pink/10 rounded-3xl p-8 sm:p-10 shadow-sm relative">
                <h3 className="text-xl font-bold mb-4 text-araina-pink flex items-center gap-2">
                  <Sparkles size={20} /> Why We Exist
                </h3>
                <p className="text-sm text-araina-black/75 font-light leading-relaxed mb-6">
                  Millions of women lack access to both high-quality,
                  transparent feminine hygiene products and accessible avenues
                  for financial growth. Araina bridges this gap by offering
                  gentle, reliable care while opening doors to skill
                  development, community support, and dignified income.
                </p>

                <div className="space-y-3 border-t border-araina-pink/10 pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className="text-araina-pink shrink-0 mt-0.5"
                      size={18}
                    />
                    <span className="text-xs text-araina-black/80 font-light">
                      Straightforward hygiene care without exaggerated or
                      fear-based messaging.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className="text-araina-pink shrink-0 mt-0.5"
                      size={18}
                    />
                    <span className="text-xs text-araina-black/80 font-light">
                      Step-by-step digital and entrepreneurial skills training
                      for women.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle
                      className="text-araina-pink shrink-0 mt-0.5"
                      size={18}
                    />
                    <span className="text-xs text-araina-black/80 font-light">
                      A supportive community focused on mutual upliftment and
                      dignity.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MISSION & VISION ==================== */}
      <section className="py-20 bg-gradient-to-b from-araina-white to-araina-pink/5 border-t border-araina-pink/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="bg-araina-white border border-araina-pink/15 rounded-3xl p-8 sm:p-10 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-araina-pink/10 text-araina-pink flex items-center justify-center mb-6">
                  <Target size={24} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-araina-pink block mb-2">
                  What We Do
                </span>
                <h3 className="text-2xl font-bold text-araina-black mb-4">
                  Our Mission
                </h3>
                <p className="text-sm text-araina-black/80 font-light leading-relaxed mb-6">
                  To create trusted women's wellness products and meaningful
                  opportunities that help women live healthier, more confident,
                  and financially stronger lives.
                </p>

                <ul className="space-y-3 text-xs text-araina-black/70 font-light">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-araina-pink mt-1.5 shrink-0" />
                    <span>
                      <strong>Promoting Health:</strong> Developing safe,
                      hygienic, quality-focused feminine wellness and
                      personal-care products.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-araina-pink mt-1.5 shrink-0" />
                    <span>
                      <strong>Creating Opportunity:</strong> Providing a
                      platform through which women can learn, start their own
                      entrepreneurial journey, and earn with dignity.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-araina-pink mt-1.5 shrink-0" />
                    <span>
                      <strong>Spreading Awareness:</strong> Encouraging open
                      conversations and positive awareness about menstrual
                      health.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-araina-white border border-araina-blue/15 rounded-3xl p-8 sm:p-10 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-araina-blue/10 text-araina-blue flex items-center justify-center mb-6">
                  <Eye size={24} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-araina-blue block mb-2">
                  Where We Are Heading
                </span>
                <h3 className="text-2xl font-bold text-araina-black mb-4">
                  Our Vision
                </h3>
                <p className="text-sm text-araina-black/80 font-light leading-relaxed mb-6">
                  To build a trusted and purpose-driven ecosystem where women's
                  health, confidence, and financial independence grow together.
                </p>

                <p className="text-xs text-araina-black/70 font-light leading-relaxed mb-6">
                  We envision a future where every woman has access to safe and
                  reliable feminine hygiene, understands the importance of her
                  own health, and has the confidence and opportunity to build a
                  financially stronger future without compromising her dignity
                  or family priorities.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-araina-blue/5 border border-araina-blue/10 text-araina-blue text-xs font-medium italic">
                "A future where every woman has the health, confidence, and
                opportunity to rise."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== OUR VALUES GRID ==================== */}
      <section className="py-20 bg-araina-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
              Our Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Our Values
            </h2>
            <p className="text-sm text-araina-black/60 font-light">
              The principles that guide how we build our company, serve women,
              make decisions, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="bg-araina-white border border-araina-pink/10 hover:border-araina-pink/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-araina-pink block mb-3 group-hover:scale-110 transition-transform origin-left">
                    {v.num}
                  </span>
                  <h4 className="text-sm font-bold text-araina-black mb-2 group-hover:text-araina-pink transition-colors">
                    {v.title}
                  </h4>
                  <p className="text-xs text-araina-black/60 font-light leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== OUR COMMITMENT ==================== */}
      <section className="py-20 bg-gradient-to-b from-araina-white via-araina-pink/5 to-araina-white border-t border-araina-pink/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue block mb-4">
              Pledge to Customers & Community
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Our Commitment
            </h2>
            <p className="text-sm text-araina-black/60 font-light">
              We hold ourselves to high standards of quality, transparency, and
              social impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {commitments.map((item, idx) => (
              <div
                key={idx}
                className="bg-araina-white border border-araina-pink/10 rounded-2xl p-6 shadow-sm"
              >
                <Award size={24} className="text-araina-pink mb-4" />
                <h4 className="text-base font-bold mb-2 text-araina-black">
                  {item.title}
                </h4>
                <p className="text-xs text-araina-black/70 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 bg-gradient-to-r from-araina-pink via-araina-pink/90 to-araina-blue/90 text-araina-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Join Us in Building a Healthier, Stronger Future
          </h2>
          <p className="text-sm text-araina-white/70 font-light max-w-xl mx-auto mb-8">
            Whether you want to discover our products or get involved with
            upcoming opportunities, we welcome you to the ARAINA community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="bg-araina-white hover:bg-araina-black hover:text-araina-white text-araina-black text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all shadow-md"
            >
              Explore About Product
            </Link>
            <Link
              to="/contact"
              className="border border-araina-white/30 hover:border-araina-white hover:bg-araina-white hover:text-araina-black text-araina-white text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full transition-all"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
