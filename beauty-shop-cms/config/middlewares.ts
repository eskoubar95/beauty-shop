export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      // Allow CORS from localhost (dev) and Vercel domains (production)
      // CORS_ORIGIN can be set as comma-separated list: "http://localhost:3000,https://your-app.vercel.app"
      origin: env.array('CORS_ORIGIN', [
        'http://localhost:3000',
        'http://localhost:8000', // Local storefront dev server
        'https://*.vercel.app', // All Vercel preview deployments
        'https://guapo-storefront.vercel.app', // Production Vercel domain (update with your actual domain)
      ]),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
