import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4201',
    supportFile: 'cypress/support/e2e.ts'
  }
});
