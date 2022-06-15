import { defineConfig } from 'astro/config'

import astroFonts from '../../../dist/index.js'

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroFonts({ url: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,700;1,400&display=swap' }),
  ],
  experimental: {
    integrations: true
  }
})
