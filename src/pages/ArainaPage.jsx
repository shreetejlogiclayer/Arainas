import React, { useEffect } from "react";
import { ArrowRight, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PublicPageCTA,
  PublicPageHero,
  SectionHeading,
  primaryPublicLink,
  secondaryPublicLink,
} from "../components/PublicPageSections";

const philosophy = [
  {
    title: "Health Is the Foundation",
    body: "A woman often spends her life caring for everyone around her, but her own health deserves the same attention. Better feminine hygiene, greater wellness awareness, and informed personal-care choices can help women approach everyday life with greater comfort and confidence.",
    icon: Heart,
  },
  {
    title: "Opportunity Opens New Possibilities",
    body: "Financial independence can change how a woman sees herself and what she believes is possible for her future. Our aim is to create opportunities where women can begin at their own pace, learn new skills, earn with dignity, and gradually build something of their own.",
    icon: Sparkles,
  },
  {
    title: "Trust Is Earned Through Actions",
    body: "Trust is built over time through responsible products and processes, transparent communication, ethical decisions, consistent quality, and genuine care for the people we serve.",
    icon: ShieldCheck,
  },
];

const ArainaPage = () => {
  useEffect(() => {
    document.title = "Know Araina | Empowering To Rise";
  }, []);

  return (
    <main className="pb-20">
      <PublicPageHero
        eyebrow="Know Araina"
        title={<>Health meets empowerment.<br />Every woman can rise.</>}
        description="ARAINA is more than a sanitary pad brand. It is a movement dedicated to transforming women’s lives through better health, dignity, confidence, and opportunity."
        image="/assets/images/campaign/woman-product.jpg"
        imageAlt="Woman holding an Araina sanitary care pack"
        imageShape="rounded-[4rem_1.25rem_4rem_1.25rem]"
      >
        <Link to="/products" className={primaryPublicLink}>
          Explore the product <ArrowRight size={14} />
        </Link>
        <Link to="/womens-health" className={secondaryPublicLink}>
          Women&apos;s health
        </Link>
      </PublicPageHero>

      <section className="section-divider butterfly-background relative overflow-hidden py-20 sm:py-24">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="About Araina"
              title="Feminine care created with purpose."
              align="left"
            />
            <div className="space-y-5 text-sm font-light leading-7 text-araina-black/70">
              <p>
                Built on the belief that every woman deserves access to safe,
                premium menstrual care and equal opportunities to grow, Araina
                is committed to creating a future where women rise with strength
                and pride. Inspired by purity, radiance, strength, and
                empowerment, Araina represents every woman as confident,
                resilient, and capable of shaping her own future.
              </p>
              <p>
                Our products are designed to provide comfort, hygiene, and
                protection, helping women experience their periods with
                confidence rather than compromise. We are committed to breaking
                menstrual stigma, promoting positive period awareness, and
                encouraging every woman to embrace her body with love, dignity,
                and confidence.
              </p>
              <p className="border-l-2 border-araina-pink/50 pl-5 font-medium text-araina-black">
                Araina is where health meets empowerment, confidence meets
                opportunity, and every woman is inspired to rise.
              </p>
            </div>
          </div>
          <figure className="relative lg:col-span-6">
            <div className="absolute -inset-4 rounded-[2rem] bg-araina-blue/10 blur-2xl" />
            <img
              src="/assets/images/campaign/open-box.jpg"
              alt="Open Araina pack with individually wrapped sanitary pads"
              className="relative aspect-[4/3] w-full rounded-[1.7rem] object-cover shadow-xl"
            />
            <figcaption className="absolute -bottom-5 right-5 rounded-xl border border-araina-pink/10 bg-white px-5 py-3 text-xs font-semibold text-araina-black shadow-lg">
              Care for her health. Respect for her journey.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section-divider py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="The Araina Philosophy"
            title="What we believe"
            description="A woman’s well-being and her ability to grow should go hand in hand. She deserves to feel healthy, comfortable, informed, confident, and financially capable—not only for herself, but for the family and community she influences every day."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {philosophy.map(({ title, body, icon: Icon }, index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-araina-pink/10 bg-white/90 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="absolute right-5 top-3 text-5xl font-extrabold text-araina-pink/[0.08]">
                  0{index + 1}
                </span>
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-araina-pink/10 text-araina-pink">
                  <Icon size={22} />
                </span>
                <h3 className="mb-3 text-lg font-bold text-araina-black">{title}</h3>
                <p className="text-sm font-light leading-7 text-araina-black/65">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-3xl border border-araina-blue/15 bg-gradient-to-r from-araina-blue/[0.08] via-white/80 to-araina-pink/[0.08] p-7 text-center sm:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-araina-blue">
              Our fundamental belief
            </p>
            <h3 className="mx-auto mt-3 max-w-3xl text-xl font-bold leading-relaxed text-araina-black sm:text-2xl">
              Every woman has the potential to rise. Sometimes she needs better
              information, the right product, guidance, an opportunity—or
              someone to believe in her.
            </h3>
            <p className="mt-4 text-sm font-light text-araina-black/65">
              We want to be that platform: one that cares about her health,
              respects her journey, and supports her next step forward.
            </p>
          </div>
        </div>
      </section>

      <section className="section-divider butterfly-background py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src="/assets/images/campaign/pad-flower.jpg"
              alt="Araina pad styled with a purple flower on a soft blue background"
              className="aspect-[4/3] w-full rounded-[1.7rem] object-cover shadow-xl"
            />
          </div>
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Quality & Trust"
              title="Trust is earned—one promise at a time."
              align="left"
            />
            <p className="text-sm font-light leading-7 text-araina-black/70">
              Women’s intimate care deserves a thoughtful and responsible
              approach. Our commitment is grounded in quality-focused practices,
              responsible product development, transparent communication, and
              continuous improvement. We do not believe in making unnecessary
              promises or creating fear to influence a woman’s choice. Instead,
              we focus on quality, communicate responsibly, listen, learn, and
              keep doing better.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["No unnecessary promises.", "No fear-based communication.", "Honest, responsible care."].map((line) => (
                <p key={line} className="rounded-2xl border border-araina-pink/10 bg-white/85 p-4 text-xs font-semibold leading-5 text-araina-black/75">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PublicPageCTA
        title="Care for her health. Support her journey."
        description="Discover Araina feminine care, explore menstrual wellness, or learn about the women’s opportunity."
      >
        <Link to="/products" className="inline-flex min-h-12 items-center rounded-full bg-white px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-araina-black transition hover:bg-araina-black hover:text-white">
          Explore product
        </Link>
        <Link to="/opportunity" className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-araina-black">
          Women&apos;s opportunity
        </Link>
      </PublicPageCTA>
    </main>
  );
};

export default ArainaPage;
