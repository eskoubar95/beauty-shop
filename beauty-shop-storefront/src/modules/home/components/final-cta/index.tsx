import Link from "next/link"

import type { FinalCtaContent } from "@lib/types/homepage"
import { buttonVariants } from "@components/ui/button"
import { cn } from "@lib/utils"

interface FinalCtaProps {
  content: FinalCtaContent
}

const FinalCtaSection = ({ content }: FinalCtaProps) => {
  if (!content) {
    return null
  }

  const {
    title,
    body,
    primaryCta,
    secondaryCta,
  } = content

  return (
    <section className="bg-background-light py-16 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-4 text-center text-primary sm:gap-10">
        <h2 className="font-semibold text-heading-2-cta-mobile sm:text-heading-2-cta-tablet lg:text-heading-2-cta-desktop">
          {title}
        </h2>
        <span className="h-px w-16 bg-primary/40" />
        <p className="max-w-2xl text-base leading-relaxed text-primary/80 sm:text-lg">
          {body}
        </p>
        {primaryCta ? (
          <Link
            href={primaryCta.href}
            className={cn(buttonVariants({ size: "lg" }), "min-w-[200px] justify-center")}
          >
            {primaryCta.label}
          </Link>
        ) : null}
      </div>
    </section>
  )
}

export default FinalCtaSection

