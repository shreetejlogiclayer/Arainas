import React, { useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  MessageCircle,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY_INFO } from "../config/siteConfig";
import {
  PublicPageCTA,
  PublicPageHero,
  SectionHeading,
  primaryPublicLink,
  secondaryPublicLink,
} from "../components/PublicPageSections";

const audience = [
  "Homemakers looking to start something of their own",
  "Women returning after a career break",
  "Working women seeking an additional entrepreneurial opportunity",
  "Women who want to build business skills",
  "Women interested in women’s wellness and community",
  "Women who want to explore entrepreneurship with guidance and support",
];

const journey = [
  ["Understand", "Explore the product, the purpose, and the way the opportunity works."],
  ["Learn", "Build practical business, communication, and digital skills."],
  ["Start", "Take your first steps at your own pace, with guidance and support."],
  ["Practice", "Understand customer needs and build relationships over time."],
  ["Grow", "Keep learning, improving, and supporting other women along the way."],
];

const skills = [
  ["Confidence", BriefcaseBusiness],
  ["Communication skills", MessageCircle],
  ["Business understanding", ChartNoAxesCombined],
  ["Digital skills", BookOpen],
  ["Customer relationships", UsersRound],
  ["Leadership & financial awareness", ChartNoAxesCombined],
];

const OpportunityPage = ({ careerPage = false }) => {
  useEffect(() => {
    document.title = careerPage
      ? "Careers & Women's Opportunity | Araina"
      : "Women's Opportunity | Araina";
  }, [careerPage]);

  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent("Hello, I would like to know more about the Araina Women’s Opportunity.")}`;

  return (
    <main className="pb-20">
      <PublicPageHero
        eyebrow={careerPage ? "Career · Women’s opportunity" : "Join the women’s opportunity"}
        title={
          careerPage
            ? <>Learn. Grow.<br />Build your journey.</>
            : <>Your dream.<br />Your opportunity.<br />Your rise.</>
        }
        description={
          careerPage
            ? "Explore a purpose-led pathway to learn, build skills, and grow with a supportive community of women."
            : "A supportive pathway for women who want to learn, grow, earn with dignity, and explore entrepreneurship around a product that addresses an everyday need."
        }
        image="/assets/images/campaign/woman-care.jpg"
        imageAlt="Woman holding a pack of Araina sanitary pads"
        imageShape="rounded-[50%]"
        imageAspect="aspect-[4/5]"
        imagePosition="object-[center_35%]"
      >
        <a href="#first-step" className={primaryPublicLink}>
          Take the first step <ArrowRight size={14} />
        </a>
        <Link to="/about" className={secondaryPublicLink}>
          About Araina
        </Link>
      </PublicPageHero>

      <section className="section-divider butterfly-background py-20 sm:py-24">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Why does this opportunity exist?"
              title="Women’s health and women’s financial independence both matter."
              align="left"
            />
            <div className="space-y-5 text-sm font-light leading-7 text-araina-black/70">
              <p>
                We have seen women with dreams, talent, education, and potential
                who want to do something of their own—but may hesitate because
                of responsibilities, lack of guidance, limited experience, or
                uncertainty about where to begin.
              </p>
              <p>
                Our goal is to create a platform where a woman can learn step
                by step, start at her own pace, build practical skills, connect
                with other women, and work towards becoming more financially
                independent.
              </p>
              <p className="font-semibold text-araina-pink">
                You don’t have to have everything figured out. You simply have
                to be ready to learn, take action, and grow.
              </p>
            </div>
          </div>
          <figure className="relative lg:col-span-6">
            <img
              src="/assets/images/campaign/product-flatlay.jpg"
              alt="Araina products arranged together in a bright blue setting"
              className="aspect-[4/3] w-full rounded-[1.7rem] object-cover shadow-xl"
            />
            <figcaption className="absolute -bottom-5 left-5 rounded-xl border border-araina-pink/10 bg-white px-5 py-3 text-xs font-semibold text-araina-black shadow-lg">
              One woman’s next step can inspire another’s.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section-divider py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Who can join?"
            title="You don’t need to be an expert to begin."
            description="The opportunity is designed for women who are ready to learn, participate, and take action."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audience.map((person, index) => (
              <article key={person} className="flex items-start gap-4 rounded-2xl border border-araina-pink/10 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-araina-pink/10 text-xs font-bold text-araina-pink">
                  0{index + 1}
                </span>
                <p className="pt-1 text-sm font-medium leading-6 text-araina-black/75">{person}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-7 max-w-3xl text-center text-sm font-light leading-7 text-araina-black/65">
            What matters is your willingness to learn, consistency,
            communication, and commitment to building relationships.
          </p>
        </div>
      </section>

      <section className="section-divider butterfly-background py-20 sm:py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="What does the opportunity involve?"
            title="This is not simply about selling a product."
            description="It is about learning how to build a small business around a product, customers, relationships, consistent activity, learning, and growth."
          />
          <div className="grid gap-4 md:grid-cols-5">
            {journey.map(([title, description], index) => (
              <article key={title} className="relative rounded-3xl border border-araina-blue/15 bg-white/90 p-6 shadow-sm">
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-araina-blue text-sm font-bold text-white">
                  0{index + 1}
                </span>
                <h3 className="text-base font-bold text-araina-black">{title}</h3>
                <p className="mt-2 text-xs font-light leading-6 text-araina-black/65">{description}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center text-sm font-bold tracking-wide text-araina-pink">
            Learn it. Practice it. Improve it. Grow with it.
          </p>
        </div>
      </section>

      <section id="journey" className="section-divider py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src="/assets/images/campaign/open-box.jpg"
              alt="Araina product box and wrapped sanitary pads"
              className="aspect-[4/3] w-full rounded-[1.7rem] object-cover shadow-xl"
            />
          </div>
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Your journey starts here"
              title="Understand → Learn → Start → Practice → Grow"
              align="left"
            />
            <p className="text-sm font-light leading-7 text-araina-black/70">
              You don’t have to build everything alone. You receive structured
              guidance, training, tools, and ongoing support designed to help
              you understand the process and take practical steps forward.
            </p>
            <p className="mt-5 text-sm font-semibold text-araina-blue">
              One step at a time. One skill at a time. One woman at a time.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {skills.map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-araina-pink/10 bg-white/85 p-4 text-xs font-semibold text-araina-black/75">
                  <Icon size={17} className="shrink-0 text-araina-pink" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-divider butterfly-background py-16">
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-araina-pink/20 bg-white/90 p-7 shadow-lg sm:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-araina-pink">
              A responsible promise
            </p>
            <h2 className="mt-3 text-lg font-bold text-araina-black sm:text-2xl">
              We believe in presenting entrepreneurship honestly.
            </h2>
            <p className="mt-4 text-sm font-light leading-7 text-araina-black/70">
              Income is not guaranteed. Individual results can vary depending on
              factors such as effort, skills, consistency, customer
              relationships, market conditions, and business activity. We
              provide an opportunity, training, tools, guidance, and support.
              Your growth depends on how you use that opportunity.
            </p>
            <p className="mt-5 border-l-4 border-araina-blue pl-4 text-sm font-semibold text-araina-blue">
              We provide the platform. You build your journey.
            </p>
          </div>
        </div>
      </section>

      <PublicPageCTA
        title="Ready to take your first step?"
        description="You don’t need to know everything today. You only need the willingness to start learning and take the first step."
      >
        <a
          id="first-step"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-araina-black transition hover:bg-araina-black hover:text-white"
        >
          Connect on WhatsApp <MessageCircle size={15} />
        </a>
        <a
          href={`tel:${COMPANY_INFO.phone.replace(/[^\d+]/g, "")}`}
          className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-araina-black"
        >
          Call us
        </a>
        <Link to="/contact" className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-araina-black">
          Send an enquiry
        </Link>
      </PublicPageCTA>
    </main>
  );
};

export default OpportunityPage;
