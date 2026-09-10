import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const JoinUsComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const audience = [
    "Homemakers looking to start something of their own",
    "Women returning after a career break",
    "Working women seeking an additional entrepreneurial opportunity",
    "Women who want to build business and digital skills",
    "Women interested in women's wellness and community",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Completely frontend-only state transition (No backend connection)
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section
      id="join-us"
      className="py-24 bg-araina-white relative overflow-hidden butterfly-background section-divider"
    >
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-araina-pink/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-araina-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Information block */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-araina-pink block mb-4">
                Be Part of the Rise
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-araina-black tracking-tight mb-6">
                Join Us
              </h2>
              <p className="text-sm sm:text-base text-araina-black/70 font-light leading-relaxed mb-8">
                We believe women's health and women's financial independence
                both matter. Through the upcoming Araina Women's Opportunity, we
                aim to create a supportive pathway for women who want to explore
                entrepreneurship, learn new skills, and connect within an
                encouraging community.
              </p>
            </motion.div>

            {/* List of who can join */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h4 className="text-xs uppercase font-bold tracking-widest text-araina-black mb-4">
                Suitable for:
              </h4>
              <ul className="space-y-3">
                {audience.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-araina-pink mt-2 shrink-0" />
                    <span className="text-xs sm:text-sm text-araina-black/80 font-light">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs font-semibold text-araina-blue tracking-wider uppercase">
                One step at a time. One skill at a time. One woman at a time.
              </p>
            </motion.div>
          </div>

          {/* Fully styled Coming Soon Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="bg-araina-white border border-araina-pink/10 rounded-3xl p-8 sm:p-10 shadow-lg relative"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="text-araina-pink w-5 h-5 animate-pulse" />
                      <span className="text-xs uppercase font-bold tracking-widest text-araina-pink">
                        Coming Soon
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-araina-black tracking-tight mb-4">
                      Something meaningful is coming.
                    </h3>
                    <p className="text-xs sm:text-sm text-araina-black/60 font-light leading-relaxed mb-8">
                      Opportunities, training programs, and community
                      participation will be introduced in the future. Leave your
                      email to receive early updates when we launch.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          className="w-full bg-araina-pink/5 border border-araina-pink/10 rounded-full px-6 py-4 text-xs sm:text-sm focus:outline-none focus:border-araina-pink/40 text-araina-black placeholder-araina-black/40 transition-all font-light"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-araina-pink hover:bg-araina-pink/90 text-araina-white text-xs uppercase tracking-widest font-bold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg shadow-araina-pink/20 flex items-center justify-center gap-2"
                      >
                        Notify Me <ArrowRight size={14} />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex p-4 bg-araina-pink/10 text-araina-pink rounded-full mb-6">
                      <CheckCircle2 size={36} className="animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold text-araina-black tracking-tight mb-3">
                      You're on the list!
                    </h3>
                    <p className="text-xs sm:text-sm text-araina-black/60 font-light leading-relaxed mb-6">
                      Thank you for your interest in Araina. We will keep you
                      updated as we take steps forward to empower women to rise.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="border border-araina-black/20 hover:border-araina-pink hover:text-araina-pink text-araina-black text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full transition-all duration-300 bg-transparent"
                    >
                      Back
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsComingSoon;
