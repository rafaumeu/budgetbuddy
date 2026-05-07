import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    env: {
      NODE_ENV: 'test',
      DATABASE_CLIENT: 'sqlite',
      DATABASE_URL: './db/test.db',
    },
    server: {
      deps: {
        inline: ['formidable', 'superagent', 'supertest', 'hexoid'],
      },
    },
  },
})
