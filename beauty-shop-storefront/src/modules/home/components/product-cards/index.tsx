import ProductCardComponent from "./product-card"
import type { ProductCard } from "@lib/types/homepage"

interface ProductCardsProps {
  products: ProductCard[]
}

const ProductCards = ({ products }: ProductCardsProps) => {
  if (!products || products.length === 0) {
    return null
  }

  const headingId = "product-selection-heading"

  return (
    <section
      aria-labelledby={headingId}
      className="bg-background-light py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col gap-4 text-primary">
          <h2
            id={headingId}
            className="max-w-3xl font-semibold text-heading-2-mobile sm:text-heading-2-tablet lg:text-heading-2-desktop tracking-[-0.04em]"
          >
            To bokse – samme kvalitet, forskellige behov
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {products.map((product, index) => (
            <ProductCardComponent
              key={product.id}
              product={product}
              variant={index === 1 ? "secondary" : "primary"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductCards


