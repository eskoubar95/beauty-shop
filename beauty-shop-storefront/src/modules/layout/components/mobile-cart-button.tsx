"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShoppingBag } from "lucide-react"
import { useMemo } from "react"

type CartLike =
  | {
      items?: Array<{
        quantity: number
      }>
    }
  | null
  | undefined

const MobileCartButton = ({ cart }: { cart: CartLike }) => {
  const totalItems = useMemo(() => {
    if (!cart?.items?.length) {
      return 0
    }

    return cart.items.reduce((acc, item) => acc + item.quantity, 0)
  }, [cart?.items])

  return (
    <LocalizedClientLink
      href="/cart"
      data-mobile-cart="true"
      aria-label={`Åbn kurv (${totalItems} vare${totalItems === 1 ? "" : "r"})`}
      className="inline-flex h-10 w-10 items-center justify-center text-primary-light transition-colors duration-150 hover:text-primary-darker lg:hidden"
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        <span
          aria-live="polite"
          className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-badge font-semibold leading-none text-white"
        >
          <span className="sr-only">Antal varer i kurv: </span>
          {totalItems}
        </span>
      </div>
    </LocalizedClientLink>
  )
}

export default MobileCartButton

