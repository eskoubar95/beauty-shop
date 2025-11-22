'use client'

import { cn } from "@lib/utils"
import type { StepCard } from "@lib/types/homepage"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"

interface StepCardProps {
  card: StepCard
  index: number
}

const StepCardComponent = ({ card, index }: StepCardProps) => {
  const { title, body, color } = card
  const isAccent = color === "accent"
  const stepLabel = `Step ${index + 1}`
  const headerColor = isAccent ? "bg-accent" : "bg-primary"
  const textColor = isAccent ? "text-primary" : "text-primary"

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-none border-0 bg-white text-center transition-transform duration-200",
        "shadow-card"
      )}
      aria-label={title}
    >
      <CardHeader
        className={cn(
          "px-8 py-5 text-left uppercase tracking-[0.28em] text-white sm:py-7",
          headerColor
        )}
      >
        <span className="text-xs font-semibold sm:text-sm">{stepLabel}</span>
      </CardHeader>
      <CardContent
        className={cn(
          "flex flex-col gap-4 px-8 py-14 text-left sm:py-16",
          textColor
        )}
      >
        <div className="flex flex-col gap-4">
          <CardTitle className="font-semibold text-heading-3-mobile sm:text-heading-3-tablet">
            {title}
          </CardTitle>
          <p className="max-w-xs text-base leading-relaxed text-primary/75">
            {body}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default StepCardComponent


