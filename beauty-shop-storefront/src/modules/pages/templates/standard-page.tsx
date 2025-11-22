import type { PageAttributes } from "@lib/types/cms"

type StandardPageTemplateProps = {
  page: PageAttributes
}

/**
 * StandardPageTemplate - For simple content pages (e.g., Handelsbetingelser, Kontakt)
 * Renders title and body content from Strapi
 */
export default function StandardPageTemplate({ page }: StandardPageTemplateProps) {
  return (
    <main>
      <div className="content-container py-12">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
          {page.body && (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.body }}
            />
          )}
        </article>
      </div>
    </main>
  )
}

