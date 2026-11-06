import React from "react";

export const PublicPageHero = ({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imageShape = "rounded-[1.6rem]",
  imageAspect = "aspect-[4/3]",
  imagePosition = "object-center",
  children,
}) => (
  <section className="relative overflow-hidden border-b border-araina-pink/10 bg-gradient-to-tr from-araina-white via-araina-pink/5 to-araina-blue/5 pb-16 pt-36 butterfly-background sm:pb-20 sm:pt-40">
    <div className={`relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 ${image ? "lg:grid-cols-12 lg:gap-14" : ""}`}>
      <div className={`${image ? "lg:col-span-7" : "mx-auto max-w-4xl text-center"} relative z-10`}>
        <span className="mb-6 inline-flex rounded-full border border-araina-pink/15 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-araina-pink shadow-sm">
          {eyebrow}
        </span>
        <h1 className="mb-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-araina-black sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-sm font-light leading-7 text-araina-black/70 sm:text-base">
          {description}
        </p>
        {children && (
          <div
            className={`mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 ${image ? "lg:justify-start" : ""}`}
          >
            {children}
          </div>
        )}
      </div>
      {image && (
        <div className="relative mx-auto w-full max-w-[540px] lg:col-span-5 lg:max-w-none">
          <div className="absolute -inset-y-4 inset-x-0 rounded-[2rem] bg-gradient-to-br from-araina-pink/15 via-transparent to-araina-blue/20 blur-2xl" />
          <div className={`relative overflow-hidden border border-white/80 bg-white/70 shadow-2xl shadow-araina-black/10 ${imageShape} ${imageAspect}`}>
            <img
              src={image}
              alt={imageAlt}
              className={`absolute inset-0 h-full w-full rounded-[inherit] object-cover ${imagePosition}`}
            />
          </div>
          <span className="absolute -bottom-4 right-3 rounded-full border border-white/60 bg-white/95 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-araina-black/65 shadow-sm backdrop-blur">
            Araina · Empowering To Rise
          </span>
        </div>
      )}
    </div>
  </section>
);

export const SectionHeading = ({ eyebrow, title, description, align = "center" }) => (
  <div
    className={`mb-10 max-w-3xl ${
      align === "center" ? "mx-auto text-center" : ""
    }`}
  >
    <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.25em] text-araina-blue">
      {eyebrow}
    </span>
    <h2 className="text-2xl font-bold leading-tight tracking-tight text-araina-black sm:text-3xl">
      {title}
    </h2>
    {description && (
      <p className="mt-4 text-sm font-light leading-7 text-araina-black/65 sm:text-base">
        {description}
      </p>
    )}
  </div>
);

export const PublicPageCTA = ({ title, description, children }) => (
  <section className="no-butterfly-background border-t border-araina-pink/10 bg-gradient-to-r from-araina-pink via-araina-pink/90 to-araina-blue py-16 text-araina-white">
    <div className="mx-auto max-w-5xl px-6 text-center">
      <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-sm font-light leading-7 text-white/85">
          {description}
        </p>
      )}
      <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  </section>
);

export const primaryPublicLink =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-araina-pink px-7 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-araina-pink/20 transition hover:-translate-y-0.5 hover:bg-araina-pink/90";

export const secondaryPublicLink =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-araina-black/15 bg-white/70 px-7 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-araina-black transition hover:border-araina-pink hover:text-araina-pink";
