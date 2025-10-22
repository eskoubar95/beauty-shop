import { buildConfig } from 'payload'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Validate required environment variables
const DATABASE_URL = process.env.DATABASE_URL
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required for Payload CMS')
}

if (!PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is required for Payload CMS')
}

export default buildConfig({
  admin: {
    user: 'users',
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  db: postgresAdapter({
    pool: {
      connectionString: DATABASE_URL,
    },
    // Add connection error handling
    migrationDir: path.resolve(__dirname, './migrations'),
  }),
  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'User', value: 'user' },
          ],
          defaultValue: 'user',
          required: true,
        },
      ],
    },
    {
      slug: 'blog-posts',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
        },
      ],
    },
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    console.log('✅ Payload CMS initialized successfully')
    
    // Test database connection
    try {
      await payload.find({
        collection: 'users',
        limit: 1,
      })
      console.log('✅ Database connection verified')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  },
})
