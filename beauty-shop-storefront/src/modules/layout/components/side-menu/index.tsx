"use client"

import {
  Popover,
  PopoverOverlay,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import Image from "next/image"
import { Fragment, useEffect } from "react"
import { AlignJustify } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SIDE_MENU_ITEMS = [
  { label: "Skincare Box", href: "/skincare-box" },
  { label: "K-Beauty", href: "/k-beauty" },
  { label: "Blog", href: "/blog" },
]

const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (!locked) {
      document.body.classList.remove("guapo-menu-open")
      return
    }

    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.body.classList.add("guapo-menu-open")
    return () => {
      document.body.style.overflow = original
      document.body.classList.remove("guapo-menu-open")
    }
  }, [locked])
}

const SideMenu = () => {
  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              {useLockBodyScroll(open)}
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  aria-label={open ? "Luk menu" : "Åbn menu"}
                  className="inline-flex h-11 w-11 items-center justify-center text-[#0B2142] transition-colors duration-150 hover:text-[#08152D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B2142]"
                >
                  <AlignJustify className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">{open ? "Luk navigation" : "Åbn navigation"}</span>
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition-opacity duration-200 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150 ease-in"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <PopoverOverlay className="fixed inset-0 bg-black/20" />
              </Transition>

              <Transition
                show={open}
                as={Fragment}
                enter="transition-transform duration-300 ease-out"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition-transform duration-250 ease-in"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <PopoverPanel className="fixed inset-0 z-50 flex transform flex-col bg-white px-6 py-8 text-[#0B2142] sm:ml-auto sm:max-w-sm sm:shadow-[0_20px_60px_rgba(5,21,55,0.18)]">
                  <div className="flex items-center justify-between">
                    <LocalizedClientLink
                      href="/"
                      aria-label="Gå til forsiden"
                      onClick={close}
                      className="inline-flex items-center"
                    >
                      <Image
                        src="/images/logos/guapo-logo-default.svg"
                        alt="GUAPO"
                        width={92}
                        height={22}
                        priority
                      />
                    </LocalizedClientLink>
                    <button
                      data-testid="close-menu-button"
                      onClick={close}
                      aria-label="Luk menu"
                      className="inline-flex h-12 w-12 items-center justify-center text-[#0B2142] transition-colors duration-150 hover:text-[#08152D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B2142]"
                    >
                      <XMark className="h-6 w-6" />
                    </button>
                  </div>

                  <nav className="mt-16 flex flex-col gap-10 text-2xl font-semibold">
                    {SIDE_MENU_ITEMS.map(({ label, href }) => (
                      <LocalizedClientLink
                        key={label}
                        href={href}
                        className="transition-colors duration-150 hover:text-[#08152D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B2142]"
                        onClick={close}
                      >
                        {label}
                      </LocalizedClientLink>
                    ))}
                  </nav>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
