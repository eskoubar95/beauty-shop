import { Suspense } from "react"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import User from "@modules/common/icons/user"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const NAV_LINKS = [
  {
    href: "/skincare-box",
    label: "Skincare Box",
    testId: "nav-skincare-box-link",
    defaultActive: true,
  },
  {
    href: "/k-beauty",
    label: "K-Beauty",
    testId: "nav-k-beauty-link",
  },
  {
    href: "/blog",
    label: "Blog",
    testId: "nav-blog-link",
  },
]

const navLinkBase =
  "relative inline-flex items-center px-5 py-7 text-sm font-medium text-primary-light transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-border after:transition-transform after:duration-150 hover:text-primary-darker hover:after:scale-x-100"

export default async function Nav() {
  return (
    <div className="sticky inset-x-0 top-0 z-50 bg-white">
      <header className="border-b border-border-light">
        {/* Desktop */}
        <div className="mx-auto hidden w-full max-w-[1440px] items-center justify-between px-8 lg:flex">
          <div className="flex items-center gap-12">
            <LocalizedClientLink
              href="/"
              data-testid="nav-store-link"
              aria-label="Gå til forsiden"
              className="inline-flex items-center"
            >
              <Image
                src="/images/logos/guapo-logo-default.svg"
                alt="GUAPO"
                width={120}
                height={28}
                priority
              />
            </LocalizedClientLink>

          </div>

          <div className="flex items-center gap-6 text-primary-light">
            <nav
              aria-label="Primær navigation"
              className="flex items-stretch"
            >
              {NAV_LINKS.map(({ href, label, testId, defaultActive }) => (
                <LocalizedClientLink
                  key={label}
                  href={href}
                  data-testid={testId}
                  className={`${navLinkBase} ${
                    defaultActive ? "text-primary-darker after:scale-x-100 after:bg-accent" : ""
                  }`}
                >
                  {label}
                </LocalizedClientLink>
              ))}
            </nav>

            <span className="hidden h-6 w-px bg-border-light lg:block" aria-hidden="true" />

            <div className="flex items-center gap-6">
            <LocalizedClientLink
              href="/account"
              data-testid="nav-account-link"
              aria-label="Gå til din konto"
              className="inline-flex h-11 w-11 items-center justify-center text-primary-light transition-colors duration-150 hover:text-primary-darker"
            >
              <User size="20" />
            </LocalizedClientLink>

            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  data-testid="nav-cart-link"
                  aria-label="Åbn kurv (0 varer)"
                  className="inline-flex h-11 w-11 items-center justify-center text-primary-light transition-colors duration-150 hover:text-primary-darker"
                >
                  <span className="sr-only">Kurv</span>
                  <span className="text-sm font-semibold text-primary-light">0</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center justify-between px-5 py-4 lg:hidden">
          <div className="flex items-center">
            <SideMenu />
          </div>

          <LocalizedClientLink
            href="/"
            aria-label="Gå til forsiden"
            className="inline-flex items-center"
          >
            <Image
              src="/images/logos/guapo-logo-default.svg"
              alt="GUAPO"
              width={96}
              height={24}
              priority
            />
          </LocalizedClientLink>

          <div className="flex items-center gap-4 text-primary-light">
            <LocalizedClientLink
              href="/account"
              data-testid="nav-account-link-mobile"
              aria-label="Gå til din konto"
              className="inline-flex h-10 w-10 items-center justify-center text-primary-light transition-colors duration-150 hover:text-primary-darker"
            >
              <User size="18" />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  data-mobile-cart="true"
                  aria-label="Åbn kurv (0 varer)"
                  className="inline-flex h-10 w-10 items-center justify-center text-primary-light transition-colors duration-150 hover:text-primary-darker lg:hidden"
                >
                  <span className="sr-only">Kurv</span>
                  <span className="text-sm font-semibold text-primary-light">0</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </div>
      </header>
    </div>
  )
}
