import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.PW_BASE_URL || 'http://localhost:5173',
  },
})
