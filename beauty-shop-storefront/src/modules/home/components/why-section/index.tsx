import Image from "next/image"

import type { WhySectionContent } from "@lib/types/homepage"

interface WhySectionProps {
  content: WhySectionContent
}

const WhySection = ({ content }: WhySectionProps) => {
  const { title, body, imageUrl, imageAlt } = content
  const headingId = "why-section-heading"

  return (
    <section
      aria-labelledby={headingId}
      className="relative overflow-hidden bg-background py-20"
    >
      <div className="flex w-full flex-col items-start gap-10 px-4 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:px-0">
        <div className="relative mx-auto aspect-square w-full overflow-hidden bg-background sm:mx-0 sm:w-full lg:mx-0 lg:w-lg xl:w-lg">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt ?? "Produktfoto fra GUAPO hudplejeboks"}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 448px, (min-width: 1024px) 384px, (min-width: 640px) 70vw, 90vw"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center border border-dashed border-primary/20 bg-gray-light text-sm font-medium uppercase tracking-[0.2em] text-primary/60">
              Billede på vej
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-6 text-primary lg:max-w-2xl xl:max-w-3xl xl:px-8">
          <h2
            id={headingId}
            className="font-semibold text-heading-2-mobile sm:text-heading-2-tablet lg:text-heading-2-desktop"
          >
            {title}
          </h2>
          <p className="text-base leading-relaxed text-primary/80 sm:text-lg">
            {body}
          </p>
        </div>
      </div>
    </section>
  )
}

export default WhySection


