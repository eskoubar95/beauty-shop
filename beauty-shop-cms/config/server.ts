export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  // Railway provides PORT env var, fallback to 1337 for local development
  port: env.int('PORT', 1337),
  // Use Railway URL in production, localhost in development
  url: env('PUBLIC_STRAPI_URL') || (env('NODE_ENV') === 'production' 
    ? `https://${env('RAILWAY_PUBLIC_DOMAIN', 'localhost')}` 
    : 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
