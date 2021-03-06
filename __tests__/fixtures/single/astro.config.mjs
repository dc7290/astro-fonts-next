import { defineConfig } from 'astro/config'
import path from 'path'

import astroFonts from '../../../dist/index.js'

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroFonts({ url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700' }),
  ],
  experimental: {
    integrations: true,
  },
  vite: {
    resolve: {
      alias: { 'astro-fonts-next/dev.js': path.join(process.cwd(), 'dist/dev.js') },
    },
  },
})
