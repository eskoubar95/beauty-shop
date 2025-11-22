/**
 * Test CMS Functionality
 * Temporary test route to verify CMS client layer
 * Access at: /dk/test-cms (or any country code)
 */

import { getPageBySlug } from "@lib/data/cms/pages";
import { getBundlePageBySlug } from "@lib/data/cms/bundle-pages";
import { listBlogPosts, getBlogPostBySlug } from "@lib/data/cms/blog";
import type { BlogPost } from "@lib/types/cms";

export default async function TestCMSPage() {
  // Test 1: Get About page
  let aboutPage = null;
  let aboutPageError = null;
  try {
    aboutPage = await getPageBySlug("about");
  } catch (error) {
    aboutPageError = error instanceof Error ? error.message : String(error);
  }

  // Test 2: Get Essentials bundle page
  let essentialsBundle = null;
  let essentialsBundleError = null;
  try {
    essentialsBundle = await getBundlePageBySlug("essentials");
  } catch (error) {
    essentialsBundleError = error instanceof Error ? error.message : String(error);
  }

  // Test 3: List blog posts
  let blogPosts: BlogPost[] = [];
  let blogPostsError = null;
  try {
    blogPosts = await listBlogPosts(5);
  } catch (error) {
    blogPostsError = error instanceof Error ? error.message : String(error);
  }

  // Test 4: Get specific blog post (if available)
  let blogPost = null;
  let blogPostError = null;
  if (blogPosts.length > 0) {
    try {
      blogPost = await getBlogPostBySlug(blogPosts[0].slug);
    } catch (error) {
      blogPostError = error instanceof Error ? error.message : String(error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">CMS Functionality Test</h1>

      <div className="space-y-8">
        {/* Test 1: Page */}
        <section className="border p-4 rounded">
          <h2 className="text-2xl font-semibold mb-4">Test 1: Page (About)</h2>
          {aboutPageError ? (
            <div>
              <p className="text-red-600">❌ Error: {aboutPageError}</p>
            </div>
          ) : aboutPage ? (
            <div>
              <p className="text-green-600">✅ Success</p>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                {JSON.stringify(aboutPage, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-yellow-600">
              ⚠️ Page not found (Strapi may not have data or permissions not set)
            </p>
          )}
        </section>

        {/* Test 2: Bundle Page */}
        <section className="border p-4 rounded">
          <h2 className="text-2xl font-semibold mb-4">
            Test 2: Bundle Page (Essentials)
          </h2>
          {essentialsBundleError ? (
            <div>
              <p className="text-red-600">❌ Error: {essentialsBundleError}</p>
            </div>
          ) : essentialsBundle ? (
            <div>
              <p className="text-green-600">✅ Success</p>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-96">
                {JSON.stringify(essentialsBundle, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-yellow-600">
              ⚠️ Bundle page not found (Strapi may not have data or permissions not set)
            </p>
          )}
        </section>

        {/* Test 3: Blog Posts List */}
        <section className="border p-4 rounded">
          <h2 className="text-2xl font-semibold mb-4">Test 3: Blog Posts List</h2>
          {blogPostsError ? (
            <div>
              <p className="text-red-600">❌ Error: {blogPostsError}</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <div>
              <p className="text-green-600">
                ✅ Success - Found {blogPosts.length} posts
              </p>
              <ul className="list-disc list-inside mt-2">
                {blogPosts.map((post) => (
                  <li key={post.slug}>
                    {post.title} ({post.slug})
                  </li>
                ))}
              </ul>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-96">
                {JSON.stringify(blogPosts, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-yellow-600">
              ⚠️ No blog posts found (Strapi may not have data or permissions not set)
            </p>
          )}
        </section>

        {/* Test 4: Single Blog Post */}
        <section className="border p-4 rounded">
          <h2 className="text-2xl font-semibold mb-4">Test 4: Single Blog Post</h2>
          {blogPostError ? (
            <div>
              <p className="text-red-600">❌ Error: {blogPostError}</p>
            </div>
          ) : blogPost ? (
            <div>
              <p className="text-green-600">✅ Success</p>
              <div className="mt-2">
                <h3 className="font-semibold">{blogPost.title}</h3>
                <p className="text-sm text-gray-600">{blogPost.excerpt}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Published: {blogPost.publishedAt || "Not published"}
                </p>
              </div>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-96">
                {JSON.stringify(blogPost, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-yellow-600">
              ⚠️ No blog posts available to test single post fetch
            </p>
          )}
        </section>

        {/* Environment Info */}
        <section className="border p-4 rounded bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">Environment Info</h2>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>STRAPI_URL:</strong>{" "}
              {process.env.NEXT_PUBLIC_STRAPI_URL || "Not set (default: http://localhost:1337)"}
            </li>
            <li>
              <strong>STRAPI_API_TOKEN:</strong>{" "}
              {process.env.STRAPI_API_TOKEN ? "Set" : "Not set (optional)"}
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

