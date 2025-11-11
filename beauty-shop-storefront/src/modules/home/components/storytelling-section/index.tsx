import Image from "next/image"

import type { StorytellingSection as StorytellingSectionContent } from "@lib/types/homepage"
interface StorytellingProps {
  content: StorytellingSectionContent
}

const StorytellingSection = ({ content }: StorytellingProps) => {
  if (!content) {
    return null
  }

  const {
    kicker,
    title,
    body,
    imageUrl,
    imageAlt,
    highlights,
    quote,
  } = content

  const paragraphs = body ? body.split("\n\n") : []

  return (
    <section className="bg-background-light py-16 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-4 sm:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-16">
        <div className="flex flex-col gap-8 text-primary">
          {kicker ? (
            <p className="uppercase tracking-[0.22em] text-primary/60">
              {kicker}
            </p>
          ) : null}
          <div className="flex flex-col gap-6 text-base leading-relaxed text-primary/80">
            <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
              {title}
            </h2>
            <div className="flex flex-col gap-5">
              {paragraphs.length > 0
                ? paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                : null}
            </div>
          </div>
          {highlights?.length ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <li key={highlight.title} className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/60">
                    {highlight.title}
                  </span>
                  <p className="text-base leading-relaxed text-primary/75">
                    {highlight.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
          {quote ? (
            <figure className="border-l-2 border-primary/15 pl-4 text-primary/80">
              <blockquote className="text-lg italic leading-relaxed">
                “{quote.text}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-primary/60">
                {quote.author}
                {quote.role ? <span className="normal-case"> · {quote.role}</span> : null}
              </figcaption>
            </figure>
          ) : null}
        </div>
        <div className="relative flex w-full justify-center">
          <div className="relative aspect-[4/3] w-full max-w-[540px] border border-[#D5DAE5] bg-[#E9EDF5]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt ?? title}
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 540px, (min-width: 1024px) 420px, (min-width: 640px) 70vw, 90vw"
                priority={false}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium uppercase tracking-[0.18em] text-primary/40">
                Billede på vej
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StorytellingSection

