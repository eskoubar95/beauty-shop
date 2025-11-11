import Image from "next/image"
import type { HeroContent } from "@lib/types/homepage"
import { Button } from "@components/ui/button"

interface HeroProps {
  content: HeroContent
}

const Hero = ({ content }: HeroProps) => {
  return (
    <section className="relative isolate h-[520px] w-full overflow-hidden sm:h-[600px] lg:h-[700px]">
      <div className="absolute inset-0 -z-10">
        {content.imageUrl ? (
          <Image
            src={content.imageUrl}
            alt={content.imageAlt ?? "GUAPO hero baggrund"}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-gray-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-black/0 to-black/10 lg:bg-gradient-to-r lg:from-black/15 lg:via-black/0 lg:to-black/5" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-end justify-start px-4 pb-0 sm:px-10 sm:pb-10 lg:px-16 lg:pb-14">
        <div className="max-w-[500px] border border-white bg-white p-7 shadow-[0_28px_70px_rgba(5,21,55,0.18)] sm:p-9 lg:max-w-[520px] lg:p-12">
          <h1 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#08152D] sm:text-[34px] lg:text-[40px]">
            {content.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#0B2142]/80 sm:text-[17px]">
            {content.body}
          </p>
          <Button variant="default" size="lg" className="mt-8">
            {content.ctaText}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
