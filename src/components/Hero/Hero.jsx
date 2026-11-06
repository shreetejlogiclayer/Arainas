import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => (
  <section
    id="home"
    className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-araina-pink/20 bg-gradient-to-tr from-araina-white via-araina-pink/5 to-araina-blue/5 pb-16 pt-28 butterfly-background"
  >
    <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-araina-pink/5 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-16 right-0 h-96 w-96 rounded-full bg-araina-blue/10 blur-3xl" />

    <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-6 lg:grid-cols-12 lg:gap-10">
      <div className="flex min-w-0 flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-5 inline-flex max-w-full justify-center rounded-full border border-araina-pink/15 bg-white/80 px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-araina-pink shadow-sm sm:px-4 sm:tracking-[0.2em]"
        >
          Women&apos;s health · Confidence · Opportunity
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 max-w-full text-[clamp(1.5rem,10vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-araina-black sm:text-6xl lg:text-7xl"
        >
          Empowering
          <br />
          <span className="bg-gradient-to-r from-araina-pink to-araina-blue bg-clip-text text-transparent">
            To Rise
          </span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl space-y-4 text-sm font-light leading-7 text-araina-black/70 sm:text-base"
        >
          <p>
            Women&apos;s health, confidence, opportunity, and empowerment—brought
            together with purpose.
          </p>
          <p>
            Araina is our flagship feminine hygiene brand, created with a simple
            purpose—to bring care, awareness, confidence, and opportunity closer
            to women.
          </p>
          <p>
            Because when a woman takes care of herself, understands her choices,
            and believes in her potential, she becomes stronger in every part
            of life. When one woman rises, she empowers another woman to rise
            alongside her.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-8 flex w-full max-w-full flex-col gap-3 sm:w-auto sm:flex-row"
        >
          <Link
            to="/araina"
            className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-full bg-araina-pink px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-lg shadow-araina-pink/20 transition hover:-translate-y-0.5 hover:bg-araina-pink/90 sm:px-7 sm:tracking-[0.16em]"
          >
            Know Araina <ArrowRight size={14} />
          </Link>
          <Link
            to="/opportunity"
            className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-full border border-araina-black/15 bg-white/70 px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-araina-black transition hover:border-araina-pink hover:text-araina-pink sm:px-7 sm:tracking-[0.16em]"
          >
            Join the Women&apos;s Opportunity
          </Link>
        </motion.div>
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-[540px] lg:col-span-5 lg:max-w-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotate: 1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-araina-pink/15 via-transparent to-araina-blue/20 blur-2xl" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[5rem_1.5rem_5rem_1.5rem] border border-white/80 bg-white/75 shadow-2xl shadow-araina-black/10">
            <img
              src="/assets/images/campaign/araina-products-yellow.jpg"
              alt="Woman holding Araina product boxes"
              className="absolute inset-0 h-full w-full rounded-[inherit] object-cover object-[center_42%]"
            />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-araina-black/70 shadow-sm backdrop-blur">
              <HeartHandshake size={15} className="text-araina-pink" />
              Care · Awareness · Opportunity
            </div>
          </div>
          <div className="absolute -right-2 top-1/2 hidden h-24 w-24 -translate-y-1/2 items-center justify-center rounded-full border-[6px] border-white bg-araina-blue text-center text-[9px] font-bold uppercase leading-4 tracking-widest text-white shadow-xl sm:flex lg:-right-6">
            Made for<br />her
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
