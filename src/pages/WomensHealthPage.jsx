import React, { useEffect } from "react";
import { ArrowRight, BookOpenCheck, HeartHandshake, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PublicPageCTA,
  PublicPageHero,
  SectionHeading,
  primaryPublicLink,
  secondaryPublicLink,
} from "../components/PublicPageSections";

const awarenessTopics = [
  "Menstrual hygiene",
  "Product choices",
  "Proper usage",
  "Comfort and suitability",
  "Responsible disposal",
  "When professional medical advice may be appropriate",
];

const carePrinciples = [
  {
    title: "Dignity",
    line: "Periods are natural. Her dignity is non-negotiable.",
    body: "Every woman deserves to experience menstruation with privacy, respect, comfort, and confidence. She should be able to talk about menstrual health without shame, ask questions without hesitation, and care for herself without embarrassment.",
    icon: HeartHandshake,
  },
  {
    title: "Confidence",
    line: "When she understands, she becomes more confident.",
    body: "Confidence begins with knowing yourself and understanding your choices. We want women to feel confident caring for their health, making informed decisions, asking questions, and continuing towards their dreams.",
    icon: ShieldCheck,
  },
  {
    title: "Responsible communication",
    line: "Our words should empower women—not influence them through fear.",
    body: "We communicate with honesty, sensitivity, clarity, and responsibility. We do not believe in exaggerated health claims, misleading messages, pressure-based selling, or unrealistic promises.",
    icon: BookOpenCheck,
  },
];

const WomensHealthPage = () => {
  useEffect(() => {
    document.title = "Women's Health & Menstrual Wellness | Araina";
  }, []);

  return (
    <main className="pb-20">
      <PublicPageHero
        eyebrow="Women’s health & menstrual wellness"
        title={<>Know your body.<br />Know your choices.</>}
        description="Your menstrual health matters—not just during your period, but as an important part of your overall well-being."
        image="/assets/images/campaign/xl-pads.jpg"
        imageAlt="Araina XL pads displayed with pink flowers on a soft pink background"
        imageShape="rounded-[3.5rem_1rem_3.5rem_1rem]"
        imageAspect="aspect-[4/3]"
      >
        <Link to="/products" className={primaryPublicLink}>
          Explore menstrual care <ArrowRight size={14} />
        </Link>
        <a href="#awareness" className={secondaryPublicLink}>
          Learn about our approach
        </a>
      </PublicPageHero>

      <section className="section-divider butterfly-background py-20 sm:py-24">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
          <figure className="relative lg:col-span-6">
            <img
              src="/assets/images/campaign/pad-flower.jpg"
              alt="Sanitary pad and flower, representing thoughtful menstrual care"
              className="aspect-[4/3] w-full rounded-[1.7rem] object-cover shadow-xl"
            />
            <figcaption className="absolute -bottom-5 left-5 max-w-xs rounded-xl border border-araina-pink/10 bg-white px-5 py-3 text-xs font-semibold leading-5 text-araina-black shadow-lg">
              Knowledge can change the way you experience your period.
            </figcaption>
          </figure>
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Our approach to menstrual care"
              title="Informed. Comfortable. Responsible. Dignified."
              align="left"
            />
            <div className="space-y-5 text-sm font-light leading-7 text-araina-black/70">
              <p>
                For us, menstrual care is more than a product. It is about
                helping women understand their menstrual health, make informed
                choices, care for themselves, and move through everyday life
                with confidence.
              </p>
              <p className="inline-flex rounded-full border border-araina-pink/15 bg-white/80 px-5 py-3 font-semibold text-araina-pink shadow-sm">
                Know. Understand. Choose. Care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="awareness" className="section-divider py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Awareness"
                title="Knowledge gives women the power to choose."
                description="Every woman deserves clear, respectful, and practical awareness about menstrual hygiene and menstrual-care choices."
                align="left"
              />
              <p className="text-sm font-light leading-7 text-araina-black/65">
                We encourage women to learn about:
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {awarenessTopics.map((topic, index) => (
                  <li key={topic} className="flex items-start gap-3 rounded-xl border border-araina-blue/10 bg-white/85 p-4 text-sm text-araina-black/75">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-araina-blue/10 text-[9px] font-bold text-araina-blue">
                      0{index + 1}
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-semibold text-araina-pink">
                Because an informed woman is better equipped to make informed choices.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3 lg:col-span-7">
              {carePrinciples.map(({ title, line, body, icon: Icon }) => (
                <article key={title} className="rounded-3xl border border-araina-pink/10 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-araina-pink/10 text-araina-pink">
                    <Icon size={22} />
                  </span>
                  <h3 className="text-lg font-bold text-araina-black">{title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-araina-blue">{line}</p>
                  <p className="mt-4 text-xs font-light leading-6 text-araina-black/65">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider butterfly-background py-20 sm:py-24">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <img
              src="/assets/images/campaign/womens-health-yellow.jpg"
              alt="Woman holding an Araina sanitary pad against a yellow background"
              className="aspect-[4/5] max-h-[560px] w-full rounded-t-[50%] rounded-b-3xl object-cover object-[center_35%] shadow-xl"
            />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-7">
            <SectionHeading
              eyebrow="Menstrual wellness education"
              title="Let’s make menstrual health easier to understand."
              align="left"
            />
            <p className="text-sm font-light leading-7 text-araina-black/70">
              We believe menstrual education should be simple, respectful,
              practical, and free from shame. Through awareness and education,
              we want to encourage women to understand their menstrual health,
              make informed choices, and feel comfortable seeking appropriate
              information and support.
            </p>
            <div className="mt-7 rounded-2xl border-l-4 border-araina-blue bg-white/80 p-5 text-sm font-medium leading-7 text-araina-black/75 shadow-sm">
              Knowledge shouldn’t stop with one woman. When one woman learns,
              she can help another woman learn. That is how awareness becomes a
              movement.
            </div>
          </div>
        </div>
      </section>

      <PublicPageCTA
        title="Inform. Educate. Respect. Empower."
        description="Explore Araina menstrual care or get in touch with our team for more information."
      >
        <Link to="/products" className="inline-flex min-h-12 items-center rounded-full bg-white px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-araina-black transition hover:bg-araina-black hover:text-white">
          Explore the product
        </Link>
        <Link to="/contact" className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-araina-black">
          Contact Araina
        </Link>
      </PublicPageCTA>
    </main>
  );
};

export default WomensHealthPage;
