import Image from "next/image"

interface BrandLogosProps {
  brandLogos: string[]
}

const formatAltText = (logo: string, index: number) => {
  const fileName = logo.split("/").pop() ?? `brand-logo-${index + 1}`
  const withoutExtension = fileName.split(".").slice(0, -1).join(".")

  if (!withoutExtension) {
    return `Brand logo ${index + 1}`
  }

  return withoutExtension
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const BrandLogos = ({ brandLogos }: BrandLogosProps) => {
  if (!brandLogos || brandLogos.length === 0) {
    return null
  }

  return (
    <section className="bg-background-light">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
        <div className="hidden w-full items-center justify-between gap-8 md:flex">
          {brandLogos.map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="flex flex-1 items-center justify-center opacity-60"
            >
              {logo.trim().endsWith(".svg") ? (
                <img
                  src={logo}
                  alt={formatAltText(logo, index)}
                  className="h-4 w-auto object-contain lg:h-6"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ) : (
                <Image
                  src={logo}
                  alt={formatAltText(logo, index)}
                  width={120}
                  height={32}
                  className="h-4 w-auto object-contain lg:h-6"
                  priority={index === 0}
                />
              )}
            </div>
          ))}
        </div>

        <div className="relative flex items-center overflow-hidden md:hidden">
          <div className="marquee flex animate-marquee gap-6">
            {[...brandLogos, ...brandLogos].map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="flex h-6 flex-shrink-0 items-center justify-center opacity-60"
              >
                {logo.trim().endsWith(".svg") ? (
                  <img
                    src={logo}
                    alt={formatAltText(logo, index)}
                    className="h-4 w-auto object-contain"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <Image
                    src={logo}
                    alt={formatAltText(logo, index)}
                    width={120}
                    height={32}
                    className="h-4 w-auto object-contain"
                    priority={index === 0}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandLogos

