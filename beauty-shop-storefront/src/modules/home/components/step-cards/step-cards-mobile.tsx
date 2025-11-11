'use client'

import { motion } from "framer-motion"

import StepCardComponent from "./step-card"
import type { StepCard } from "@lib/types/homepage"

interface StepCardsMobileProps {
  cards: StepCard[]
}

const StepCardsMobile = ({ cards }: StepCardsMobileProps) => {
  return (
    <div className="flex flex-col gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={`${card.title}-${index}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, delay: index * 0.05 }}
        >
          <StepCardComponent card={card} index={index} />
        </motion.div>
      ))}
    </div>
  )
}

export default StepCardsMobile


