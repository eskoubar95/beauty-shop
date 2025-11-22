'use client'

import { motion } from "framer-motion"

import StepCardComponent from "./step-card"
import type { StepCard } from "@lib/types/homepage"

interface StepCardsDesktopProps {
  cards: StepCard[]
}

const StepCardsDesktop = ({ cards }: StepCardsDesktopProps) => {
  return (
    <div className="grid grid-cols-3 gap-8">
      {cards.map((card, index) => (
        <motion.div
          key={`${card.title}-${index}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
        >
          <StepCardComponent card={card} index={index} />
        </motion.div>
      ))}
    </div>
  )
}

export default StepCardsDesktop


