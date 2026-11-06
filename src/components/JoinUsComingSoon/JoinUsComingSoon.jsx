import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const audience = [
  "Homemakers looking to start something of their own",
  "Women returning after a career break",
  "Working women seeking an additional entrepreneurial opportunity",
  "Women who want to build business skills",
];

const JoinUsComingSoon = () => (
  <section
    id="join-us"
    className="relative overflow-hidden border-y border-araina-pink/10 py-20 butterfly-background sm:py-24"
  >
    <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-araina-pink/5 blur-3xl" />
    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.3em] text-araina-pink">
          Your dream. Your opportunity. Your rise.
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-araina-black sm:text-4xl">
          Join the Women&apos;s Opportunity
        </h2>
        <p className="mt-5 max-w-2xl text-sm font-light leading-7 text-araina-black/70">
          At Araina, we believe women deserve opportunities to learn, grow, earn
          with dignity, and build confidence—while being part of a community
          that supports one another. You don&apos;t have to have everything
          figured out. You simply have to be ready to learn, take action, and
          grow.
        </p>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {audience.map((item) => (
            <li key={item} className="flex items-start gap-3 text-xs leading-5 text-araina-black/75">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-araina-blue" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-7 text-xs font-semibold uppercase tracking-wider text-araina-blue">
          One step at a time. One skill at a time. One woman at a time.
        </p>
        <Link
          to="/opportunity"
          className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-araina-pink px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-araina-pink/20 transition hover:-translate-y-0.5 hover:bg-araina-pink/90"
        >
          Explore the opportunity <ArrowRight size={14} />
        </Link>
      </div>

      <figure className="relative mx-auto w-full max-w-[500px] lg:col-span-5 lg:max-w-none">
        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-araina-pink/15 to-araina-blue/15 blur-2xl" />
        <img
          src="/assets/images/campaign/product-flatlay.jpg"
          alt="Araina feminine care products arranged as a collection"
          className="relative aspect-[4/3] w-full rounded-[1.5rem_5rem_1.5rem_5rem] object-cover shadow-xl"
        />
        <figcaption className="absolute -bottom-5 right-5 rounded-xl border border-araina-pink/10 bg-white px-5 py-3 text-xs font-semibold text-araina-black shadow-lg">
          Learn. Grow. Rise together.
        </figcaption>
      </figure>
    </div>
  </section>
);

export default JoinUsComingSoon;
