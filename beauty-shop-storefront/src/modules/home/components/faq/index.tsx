'use client'
import type { FaqItem } from "@lib/types/homepage"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion"

interface FaqSectionProps {
  items: FaqItem[]
}

const FaqSection = ({ items }: FaqSectionProps) => {
  if (!items || items.length === 0) {
    return null
  }

  const midpoint = Math.ceil(items.length / 2)
  const columns = [items.slice(0, midpoint), items.slice(midpoint)].filter(
    (column) => column.length > 0
  )

  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center text-primary">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary/60">
            FAQ
          </p>
          <h2 className="font-semibold text-heading-2-mobile sm:text-heading-2-tablet lg:text-heading-2-desktop">
            Ofte stillede spørgsmål
          </h2>
          <p className="text-base leading-relaxed text-primary/75 sm:text-lg">
            Få svar på de mest almindelige spørgsmål om GUAPO abonnementet. Finder
            du ikke det du leder efter, så kontakt os – vi hjælper gerne.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {columns.map((column, columnIndex) => (
            <Accordion
              key={`faq-column-${columnIndex}`}
              type="single"
              collapsible
              className="w-full divide-y divide-primary/15"
            >
              {column.map((item, index) => (
                <AccordionItem
                  key={`${item.question}-${columnIndex}-${index}`}
                  value={`faq-${columnIndex}-${index}`}
                  className="border-none"
                >
                  <AccordionTrigger className="px-6 py-5 text-left text-lg font-semibold tracking-tight text-primary hover:no-underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-base leading-relaxed text-primary/80">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FaqSection

