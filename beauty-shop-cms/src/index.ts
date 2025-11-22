import type { Core } from '@strapi/strapi';
import bootstrapPermissions from './bootstrap';
import seedData from './seed';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Configure public role permissions for content types
    await bootstrapPermissions({ strapi });
    
    // Seed test data if TEST_SEED or SEED_DATA is set
    if (process.env.TEST_SEED === 'true' || process.env.SEED_DATA === 'true') {
      await seedData({ strapi });
    }
  },
};
