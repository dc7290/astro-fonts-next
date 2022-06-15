import { defineConfig } from 'astro/config'

import astroFonts from '../../../dist/index.js'

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroFonts({
      url: [
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700',
        'https://fonts.googleapis.com/css2?family=Lato:wght@400;700',
      ],
    }),
  ],
  experimental: {
    integrations: true
  }
})
