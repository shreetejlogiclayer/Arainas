import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle,
  Eye,
  Factory,
  HandHeart,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

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
      icon: Factory,
    },
    {
      title: "Dignity & Respect",
      desc: "Normalizing conversations around menstrual health with dignity and zero fear-based marketing.",
      icon: HandHeart,
    },
    {
      title: "Entrepreneurial Pathways",
      desc: "Creating accessible, step-by-step learning and income opportunities for women at all stages of life.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Long-term Impact",
      desc: "Building a sustainable platform that lifts individuals, households, and entire communities.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="pt-0 pb-20 min-h-screen bg-araina-white text-araina-black">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-40 pb-16 lg:pt-48 lg:pb-24 bg-gradient-to-tr from-araina-white via-araina-pink/5 to-araina-blue/5 overflow-hidden border-b border-araina-pink/10">
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
                About Royo Essentials LLP & ARAINA
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6"
              >
                More Than a Company.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-araina-pink to-araina-blue">
                  A Purpose in Motion.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm sm:text-base text-araina-black/75 font-light leading-relaxed mb-8 max-w-2xl"
              >
                At Royo Essentials LLP, we believe that a business becomes
                truly meaningful when it creates value beyond its products. We
                are a purpose-driven health, wellness, and personal-care company
                focused on bringing together women&apos;s health, menstrual
                wellness, education, entrepreneurship, and empowerment. We are
                building a platform where care meets opportunity, knowledge
                meets confidence, and women can move forward with purpose.
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

            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative overflow-hidden rounded-t-[50%] rounded-b-3xl border border-araina-pink/15 shadow-xl group"
              >
                <img
                  src="/assets/images/campaign/womens-health-yellow.jpg"
                  alt="Woman holding an Araina sanitary pad"
                  className="aspect-[4/5] max-h-[560px] w-full object-cover object-[center_35%] transform group-hover:scale-105 transition-transform duration-700"
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
                  financially stronger. That led to the creation of Royo
                  Essentials LLP and Araina as our flagship brand.
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
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-araina-pink/10 text-araina-pink">
                  <Target size={27} strokeWidth={1.8} />
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
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-araina-blue/10 text-araina-blue">
                  <Eye size={27} strokeWidth={1.8} />
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
            {commitments.map((item, idx) => {
              const Icon = item.icon;
              return (
              <div
                key={idx}
                className="rounded-2xl border border-araina-pink/10 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-araina-pink/25 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-araina-pink/10 text-araina-pink">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <h4 className="text-base font-bold mb-2 text-araina-black">
                  {item.title}
                </h4>
                <p className="text-xs text-araina-black/70 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-araina-white via-araina-blue/5 to-araina-pink/5 border-t border-araina-pink/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-blue block mb-4">
                What We Do
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
                Products, knowledge, and opportunity—connected.
              </h2>
              <p className="text-sm text-araina-black/70 font-light leading-relaxed">
                Royo Essentials LLP operates across sales, marketing, and
                training, with a focus on women&apos;s health, wellness, and
                opportunity. Through Araina, we provide feminine hygiene
                products while encouraging greater awareness around menstrual
                wellness and responsible menstrual care.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
              {[
                ["Products for her health", "Thoughtfully positioned feminine-care products designed around women’s needs."],
                ["Knowledge for her awareness", "Encouraging women to understand menstrual wellness and make informed choices."],
                ["Opportunities for her growth", "A pathway for women to learn, build skills, explore entrepreneurship, and work towards greater financial independence."],
              ].map(([title, description], idx) => (
                <article key={title} className="rounded-2xl border border-araina-pink/10 bg-white p-5 shadow-sm">
                  <span className="text-xs font-bold tracking-widest text-araina-pink">0{idx + 1}</span>
                  <h3 className="mt-4 text-sm font-bold text-araina-black">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-araina-black/65">{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            <article className="min-w-0 max-w-full rounded-3xl border border-araina-blue/15 bg-white/90 p-5 sm:p-9">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-araina-blue">
                Our Philosophy · Empowering To Rise
              </span>
              <h3 className="mt-3 text-2xl font-bold text-araina-black">
                Every woman has the potential to create something meaningful.
              </h3>
              <p className="mt-4 text-sm font-light leading-7 text-araina-black/70">
                Some women may already be taking steps towards their dreams.
                Others may simply need the right opportunity, encouragement,
                knowledge, or support to begin. We want to create an environment
                where women can learn, take action, build confidence, grow,
                support one another, and rise.
              </p>
              <p className="mt-4 text-sm font-semibold text-araina-pink">
                When one woman rises, she should not have to rise alone.
              </p>
            </article>
            <article className="min-w-0 max-w-full rounded-3xl border border-araina-pink/15 bg-gradient-to-br from-araina-pink/[0.06] via-white to-araina-blue/[0.08] p-5 sm:p-9">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-araina-pink">
                Our Long-Term Direction
              </span>
              <h3 className="mt-3 text-2xl font-bold leading-snug text-araina-black">
                We don’t want to simply grow bigger. We want to grow deeper,
                stronger, and more meaningful.
              </h3>
              <p className="mt-4 text-sm font-light leading-7 text-araina-black/70">
                Our ambition is to build Royo Essentials LLP into a trusted
                organization with a meaningful presence in women&apos;s wellness
                and empowerment. We want our journey to extend beyond products
                and transactions—to knowledge, relationships, opportunities,
                community, and social impact.
              </p>
              <p className="mt-4 text-sm font-medium text-araina-blue">
                Our future is not only about how far we can go. It is about how
                many women we can encourage to move forward with us.
              </p>
            </article>
          </div>

          <div className="mt-6 rounded-3xl border border-araina-pink/15 bg-white p-7 sm:p-9">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-araina-blue">
                  Our Promise
                </span>
                <p className="mt-3 text-sm font-light leading-7 text-araina-black/70">
                  Trust is built through consistency, responsibility,
                  transparency, quality, meaningful relationships, and the
                  willingness to keep improving. We aspire to be a company women
                  can feel proud to be associated with, a brand that respects
                  the woman behind every product, and a community where women
                  know they do not have to grow alone.
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-araina-pink">
                  Our Belief
                </span>
                <p className="mt-3 text-sm font-light leading-7 text-araina-black/70">
                  A woman can care for her family and still have dreams of her
                  own. She can prioritize her health and still pursue ambitious
                  goals. She can begin with a small step, build something
                  meaningful, and reach back to help another woman rise too.
                </p>
              </div>
            </div>
            <p className="mt-6 border-t border-araina-pink/10 pt-5 text-center text-sm font-semibold text-araina-pink">
              When one woman rises, she empowers another woman to rise alongside her.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="no-butterfly-background py-16 bg-gradient-to-r from-araina-pink via-araina-pink/90 to-araina-blue/90 text-araina-white">
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
