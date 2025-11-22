/**
 * Strapi CMS Client
 * Centralized fetch helper for Strapi REST API calls
 */

// Normalize Strapi URL (remove trailing slash to avoid double slashes)
const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"
).replace(/\/$/, ""); // Remove trailing slash

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; // optional

/**
 * Fetch data from Strapi CMS
 * @param path - API path (e.g., "/api/pages")
 * @param init - Optional fetch init options
 * @returns Promise with typed response
 */
async function fetchFromStrapi<T>(path: string, init?: RequestInit): Promise<T> {
  // Ensure path starts with / for proper URL construction
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, STRAPI_URL).toString();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    (headers as any).Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const res = await fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {}),
    },
    // Use no-store in development for easier debugging
    // In production, use Next.js cache with ISR (revalidate set in page.tsx)
    cache: init?.cache ?? (process.env.NODE_ENV === "development" ? "no-store" : "force-cache"),
    // Next.js will respect revalidate from page.tsx when using force-cache
  });

  if (!res.ok) {
    // 404 is a valid "not found" response, not an error
    if (res.status === 404) {
      // Return empty response structure matching Strapi format
      // For list endpoints, return empty array; for single endpoints, return null
      if (path.includes("?") || path.endsWith("s")) {
        // Likely a list endpoint (e.g., /api/blog-posts)
        return { data: [] } as T;
      }
      // Single item endpoint
      return { data: null } as T;
    }

    // For other errors, log and throw
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[Strapi Client] Request failed: ${path} (${res.status})`
      );
    }
    throw new Error(`Strapi request failed for ${path} (${res.status})`);
  }

  return (await res.json()) as T;
}

export { fetchFromStrapi };

