import Image from "next/image"
import Link from "next/link"

import { homepageContent } from "@lib/data/homepage-content"
import { cn } from "@lib/utils"

const Footer = () => {
  const { footer } = homepageContent

  return (
    <footer className="bg-[#1E1E1C] text-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-4 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/logos/guapo-logo-white.svg"
                alt="GUAPO logo"
                width={132}
                height={32}
                priority
              />
            </Link>
            <p className="text-base leading-relaxed text-white/70">
              {footer.brand.description}
            </p>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-10 text-base sm:grid-cols-2 lg:grid-cols-3">
            {footer.linkGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                  {group.title}
                </span>
                <ul className="flex flex-col gap-3 text-white/80">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-white"
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {footer.brand.name}. Alle rettigheder forbeholdes.</p>
          <div className="flex flex-wrap items-center gap-6">
            {footer.legal.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white"
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
