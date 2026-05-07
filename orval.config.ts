import { defineConfig } from 'orval'

export default defineConfig({
  budgetbuddy: {
    input: {
      target: 'http://localhost:3333/docs/json',
    },
    output: {
      target: './src/client/budgetbuddy-client.ts',
      client: 'axios',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/client/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
