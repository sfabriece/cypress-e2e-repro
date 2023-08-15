import { execSync } from 'node:child_process';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { PrismaClient } from '@prisma/client';
import { defineConfig } from 'cypress';

import { emptyAndSeedDatabase } from './src/support/db';

const DB_URLS = ['postgresql://postgres:docker@localhost:5462/postgres'];

export default defineConfig({
  retries: {
    runMode: 2
  },
  e2e: {
    ...nxE2EPreset(__dirname),
    testIsolation: true,
    viewportHeight: 1080,
    viewportWidth: 1920,
    setupNodeEvents(on, config) {
      const prisma = new PrismaClient({
        log: ['warn', 'error']
      });

      on('before:run', () => {
        const url = process.env['DATABASE_URL'] ?? '';

        if (!DB_URLS.some((v) => url.includes(v))) {
          throw new Error(
            'Not allowed to run in QA or PROD environment\nPlease change your DB urls'
          );
        }

        execSync('yarn db:reset', {
          stdio: 'inherit'
        });
      });

      on('task', {
        async 'db:seed'() {
          // seed database with test data
          const url = process.env['DATABASE_URL'] ?? '';

          if (!DB_URLS.some((v) => url.includes(v))) {
            throw new Error(
              'Not allowed to run in QA or PROD environment\nPlease change your DB urls'
            );
          }

          await emptyAndSeedDatabase();

          return 'DB reset and seeded';
        },

        // fetch test data from a database (MySQL, PostgreSQL, etc...)
        // 'filter:database'(queryPayload) {
        //   return queryDatabase(queryPayload, (data: any, attributes: any) =>
        //     filter(data.results, attributes)
        //   );
        // },
        async 'find:database'({ model }: { model: 'user'; query: any }) {
          const entity = await prisma[model].findFirstOrThrow();
          return entity;
        }
      });

      return config;
    }
  }
});
