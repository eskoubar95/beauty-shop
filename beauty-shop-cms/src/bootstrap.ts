/**
 * Bootstrap script for Strapi
 * Configures permissions for public role
 */
import type { Core } from '@strapi/strapi';

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  try {
    // Get the public role
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({
        where: { type: 'public' },
      });

    if (!publicRole) {
      console.warn('⚠️  Public role not found, skipping permission configuration');
      return;
    }

    // Content types to allow public read access
    const contentTypes = ['api::page.page', 'api::bundle-page.bundle-page', 'api::blog-post.blog-post'];

    // Get all permissions for public role
    const permissions = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({
        where: {
          role: publicRole.id,
        },
      });

    // Update permissions for each content type
    for (const contentType of contentTypes) {
      // Find permissions for this content type
      const contentTypePermissions = permissions.filter((p: any) => p.action.includes(contentType));

      // Enable find and findOne for public role
      const actions = ['find', 'findOne'];
      for (const action of actions) {
        const permission = contentTypePermissions.find((p: any) => p.action === `${contentType}.${action}`);

        if (permission) {
          // Permission exists, enable it
          await strapi.query('plugin::users-permissions.permission').update({
            where: { id: permission.id },
            data: { enabled: true },
          });
          console.log(`✅ Enabled ${contentType}.${action} for public role`);
        } else {
          // Permission doesn't exist, create it
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: `${contentType}.${action}`,
              role: publicRole.id,
              enabled: true,
            },
          });
          console.log(`✅ Created and enabled ${contentType}.${action} for public role`);
        }
      }
    }

    console.log('✅ Public role permissions configured');
  } catch (error) {
    console.error('❌ Error configuring permissions:', error);
    // Don't throw - allow Strapi to start even if permissions fail
  }
};
