import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

import { Users } from './collections/users';
import { Media } from './collections/media';
import { Pages } from './collections/pages';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required.');
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      collections: ['pages'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media, Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./data/payload.db',
    },
  }),
  sharp,
  onInit: async (payload) => {
    // Seed: create initial admin user if none exists
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    });

    if (existingUsers.totalDocs === 0) {
      const seedEmail = process.env.SEED_ADMIN_EMAIL;
      const seedPassword = process.env.SEED_ADMIN_PASSWORD;

      if (!seedEmail || !seedPassword) {
        payload.logger.warn(
          'SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD environment variables are required to seed the initial admin user.',
        );
        return;
      }

      await payload.create({
        collection: 'users',
        data: {
          email: seedEmail,
          password: seedPassword,
          role: 'admin',
        },
      });

      // Create a published page
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          _status: 'published',
        },
      });

      // Create a draft page
      await payload.create({
        collection: 'pages',
        data: {
          title: 'About (Draft)',
          slug: 'about',
          _status: 'draft',
        },
        draft: true,
      });

      payload.logger.info('✓ Seed complete: admin user + 2 pages created');
    }
  },
});
