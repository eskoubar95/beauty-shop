import type { StepCard } from "@lib/types/homepage"
import StepCardsDesktop from "./step-cards-desktop"
import StepCardsMobile from "./step-cards-mobile"

interface StepCardsProps {
  cards: StepCard[]
}

const StepCards = ({ cards }: StepCardsProps) => {
  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <section className="bg-background-light py-16 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 sm:px-8 lg:px-16">
        <div className="hidden lg:block">
          <StepCardsDesktop cards={cards} />
        </div>
        <div className="lg:hidden">
          <StepCardsMobile cards={cards} />
        </div>
      </div>
    </section>
  )
}

export default StepCards


