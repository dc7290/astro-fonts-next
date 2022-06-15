import type { AstroIntegration } from 'astro'

import plugin from './plugin.js'
import { OPTIMIZED_FONT_PROVIDERS } from './utils/constants.js'

const LIB_NAME = 'astro-fonts-next'

export interface AstroFontsNextOptions {
  url: string | string[]
}

export default (options: AstroFontsNextOptions): AstroIntegration => {
  return {
    name: LIB_NAME,
    hooks: {
      'astro:config:setup': async ({ command, updateConfig }) => {
        if (!options.url || options.url === '' || options.url.length === 0) {
          throw new Error(`[${LIB_NAME}]: you must set a \`url\` in your config!`)
        }

        const urls: string[] = []

        if (typeof options.url === 'string') {
          urls.push(options.url)
        }
        if (Array.isArray(options.url)) {
          urls.push(...options.url)
        }

        // Check if the URL is valid
        urls.forEach((url) => {
          try {
            new URL(url)
          } catch (_) {
            throw new Error(`[${LIB_NAME}]: \`${url}\` is not a valid URL.`)
          }
        })

        urls.forEach((url) => {
          if (OPTIMIZED_FONT_PROVIDERS.findIndex((providers) => url.startsWith(providers.url)) === -1) {
            throw new Error(`[${LIB_NAME}]: \`${url}\` is not supported`)
          }
        })

        updateConfig({
          vite: { plugins: [plugin({ urls, command })] },
        })
      },
    },
  }
}
