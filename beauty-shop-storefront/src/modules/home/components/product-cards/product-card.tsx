import Image from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  CalendarDays,
  CheckCircle2,
  Info,
  Package2,
  Sparkles,
  Truck,
} from "lucide-react"

import type { ProductCard } from "@lib/types/homepage"
import { formatCurrencyDKK } from "@lib/formatters/currency"
import { cn } from "@lib/utils"
import { buttonVariants } from "@components/ui/button"

type ProductCardVariant = "primary" | "secondary"

interface ProductCardProps {
  product: ProductCard
  variant?: ProductCardVariant
}

const featureIcons: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  package: Package2,
  delivery: Truck,
  premium: Sparkles,
  included: CheckCircle2,
}

const renderSubItem = (text: string) => {
  const [primary, secondary] = text.split(" - ")

  if (!secondary) {
    return text
  }

  return (
    <>
      {primary}
      {" - "}
      <span className="italic text-primary/65">{secondary}</span>
    </>
  )
}

const ProductCardComponent = ({ product, variant = "primary" }: ProductCardProps) => {
  const { title, subtitle, features, price, imageUrl, imageAlt, badge, ctaText, ctaHref } =
    product

  const isSecondaryVariant = variant === "secondary"

  const firstMonth = formatCurrencyDKK(price.firstMonth, {
    currencyDisplay: "code",
  })
  const subsequent = formatCurrencyDKK(price.subsequent, {
    currencyDisplay: "code",
  })

  return (
    <article
      className={cn(
        "flex h-full flex-col border border-border bg-white shadow-product-card transition-transform duration-200 hover:-translate-y-1",
        isSecondaryVariant && "bg-background-lighter"
      )}
    >
      <div className="px-8 pt-8 sm:pt-10">
        <div className="relative aspect-video w-full border border-border-lighter bg-image-placeholder">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt ?? `${title} boks`}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 460px, (min-width: 1024px) 380px, (min-width: 640px) 60vw, 90vw"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium uppercase tracking-[0.18em] text-primary/40">
              Billede på vej
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-8 px-8 pb-8 pt-6 text-primary sm:pb-10 sm:pt-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-semibold tracking-tight text-heading-3-mobile sm:text-heading-3-tablet">
              {title}
            </h3>
            {badge ? (
              <span className="bg-primary-darker px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="text-base text-primary/75 sm:text-lg">{subtitle}</p>
        </div>

        <ul className="flex flex-col gap-5">
          {features.map((feature) => {
            const Icon: LucideIcon = featureIcons[feature.icon] ?? Info

            return (
              <li key={feature.label} className="flex gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-2">
                  <p className="text-base font-medium">{feature.label}</p>
                  {feature.subItems?.length ? (
                    <ul className="flex flex-col gap-1 text-sm text-primary/70">
                      {feature.subItems.map((item) => (
                        <li key={item.text}>{renderSubItem(item.text)}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>

        <div className="mt-auto flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary/60">
              Første måned:
            </span>
            <span className="font-semibold text-price-mobile sm:text-price-tablet lg:text-price-desktop">
              {firstMonth}
            </span>
            <span className="text-sm font-semibold text-accent">
              efterfølgende fast {subsequent}/pr. måned
            </span>
          </div>

          <div>
            {ctaHref ? (
              <Link
                href={ctaHref}
                className={cn(
                  buttonVariants({
                    size: "lg",
                    variant: isSecondaryVariant ? "outline" : "default",
                  }),
                  "w-full justify-center"
                )}
              >
                {ctaText}
              </Link>
            ) : (
              <button
                type="button"
                className={cn(
                  buttonVariants({
                    size: "lg",
                    variant: isSecondaryVariant ? "outline" : "default",
                  }),
                  "w-full justify-center"
                )}
              >
                {ctaText}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCardComponent
