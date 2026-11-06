import React, { useEffect } from "react";
import { ArrowRight, Images } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PublicPageCTA,
  PublicPageHero,
  SectionHeading,
  primaryPublicLink,
  secondaryPublicLink,
} from "../components/PublicPageSections";

const gallery = [
  {
    src: "/assets/images/campaign/product-flatlay.jpg",
    alt: "Araina product boxes arranged with blue flowers and ribbon",
    caption: "Araina · A purpose in every detail",
    layout: "md:col-span-2 md:row-span-2",
    shape: "rounded-[3rem_0.75rem_1rem_0.75rem]",
  },
  {
    src: "/assets/images/campaign/open-box.jpg",
    alt: "Open Araina pack showing individually wrapped pads",
    caption: "Inside the Araina pack",
    layout: "",
    shape: "rounded-[0.75rem_3rem_0.75rem_1rem]",
  },
  {
    src: "/assets/images/campaign/araina-products-yellow.jpg",
    alt: "Woman holding Araina product boxes against a yellow backdrop",
    caption: "Made for every woman",
    layout: "md:row-span-2",
    shape: "rounded-t-[50%] rounded-b-xl",
  },
  {
    src: "/assets/images/campaign/pad-clouds.jpg",
    alt: "Araina pad against a soft cloud background",
    caption: "Thoughtful menstrual care",
    layout: "md:row-span-2",
    shape: "rounded-[50%_50%_1rem_1rem]",
  },
  {
    src: "/assets/images/campaign/pad-flower.jpg",
    alt: "Araina pad and purple flower on a blue background",
    caption: "Comfort, care, and confidence",
    layout: "",
    shape: "rounded-[3rem_0.75rem_0.75rem_1rem]",
  },
  {
    src: "/assets/images/campaign/wrapped-pads.jpg",
    alt: "Individually wrapped Araina pads on a pink background",
    caption: "Individually wrapped pads",
    layout: "md:row-span-2",
    shape: "rounded-[3rem_0.75rem_3rem_0.75rem]",
  },
  {
    src: "/assets/images/campaign/xxl-pads.jpg",
    alt: "Individually wrapped XXL Araina pads arranged on blue",
    caption: "XXL size",
    layout: "",
    shape: "rounded-[0.75rem_3rem_1rem_0.75rem]",
  },
  {
    src: "/assets/images/campaign/open-pack.jpg",
    alt: "Open Araina box and pad arranged with a purple flower",
    caption: "A closer look",
    layout: "",
    shape: "rounded-[3rem_3rem_0.75rem_0.75rem]",
  },
  {
    src: "/assets/images/campaign/woman-care.jpg",
    alt: "Woman holding Araina pads in front of a bright yellow background",
    caption: "Her care, her confidence",
    layout: "md:row-span-2",
    shape: "rounded-t-[50%] rounded-b-xl",
  },
  {
    src: "/assets/images/campaign/woman-product.jpg",
    alt: "Woman holding an Araina sanitary care pack",
    caption: "Care made personal",
    layout: "md:row-span-2",
    shape: "rounded-[0.75rem_2.5rem_1rem_0.75rem]",
  },
  {
    src: "/assets/images/campaign/xl-pads.jpg",
    alt: "Individually wrapped XL Araina pads arranged on pink",
    caption: "XL size",
    layout: "",
    shape: "rounded-[3rem_0.75rem_0.75rem_1rem]",
  },
  {
    src: "/assets/images/campaign/product-range.jpg",
    alt: "Araina pads and individual packs arranged together",
    caption: "Araina product range",
    layout: "md:col-span-2",
    shape: "rounded-[0.75rem_0.75rem_1rem_3rem]",
  },
  {
    src: "/assets/images/campaign/care-product-pack-pink.jpg",
    alt: "Araina XL pack opened by hand against a pink background",
    caption: "XL pack · Pink edition",
    layout: "md:row-span-2",
    shape: "rounded-[3rem_1rem_0.75rem_0.75rem]",
    imageTransform: "rotate-180",
  },
  {
    src: "/assets/images/campaign/menstrual-care-blue.jpg",
    alt: "Sanitary pad arranged on a soft blue background",
    caption: "Softness in focus",
    layout: "md:col-span-2",
    shape: "rounded-[1rem_3rem_0.75rem_1rem]",
  },
  {
    src: "/assets/images/campaign/womens-health-yellow.jpg",
    alt: "Woman holding an Araina sanitary pad against a yellow background",
    caption: "Her health. Her choice.",
    layout: "md:row-span-2",
    shape: "rounded-t-[50%] rounded-b-xl",
  },
];

const MediaPage = () => {
  useEffect(() => {
    document.title = "Media & Gallery | Araina";
  }, []);

  return (
    <main className="pb-20">
      <PublicPageHero
        eyebrow="Media · Gallery"
        title={<>A closer look at<br />Araina.</>}
        description="A visual story of our feminine-care products, thoughtful details, and the women at the heart of our purpose."
      >
        <a href="#gallery" className={primaryPublicLink}>
          View the gallery <Images size={15} />
        </a>
        <Link to="/about" className={secondaryPublicLink}>
          About Araina
        </Link>
      </PublicPageHero>

      <section id="gallery" className="section-divider butterfly-background py-20 sm:py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Araina product & brand gallery"
            title="Designed to be seen. Made with her in mind."
            description="Explore the product photography shared with us. We’ll add company-work and community-impact stories when those materials are available."
          />
          <div className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[210px] md:grid-cols-4">
            {gallery.map((image) => (
              <figure
                key={image.src}
                className={`group relative isolate overflow-hidden border border-white/80 bg-white shadow-md ${image.layout} ${image.shape || "rounded-[2rem_0.75rem_2rem_0.75rem]"}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105 ${image.imageTransform || ""}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-araina-black/65 via-transparent to-transparent opacity-90" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 text-xs font-semibold tracking-wide text-white sm:p-5">
                  <span className="inline-block rounded-xl bg-araina-black/45 px-3 py-2 backdrop-blur-sm">
                    {image.caption}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <PublicPageCTA
        title="The story is bigger than the product."
        description="Discover the purpose behind Araina and the opportunity we’re building with women."
      >
        <Link to="/araina" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-araina-black transition hover:bg-araina-black hover:text-white">
          Know Araina <ArrowRight size={14} />
        </Link>
        <Link to="/opportunity" className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-7 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-araina-black">
          Women&apos;s opportunity
        </Link>
      </PublicPageCTA>
    </main>
  );
};

export default MediaPage;
