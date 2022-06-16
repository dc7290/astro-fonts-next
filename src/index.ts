import type { AstroIntegration } from 'astro'
import { load } from 'cheerio'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'node:path'

import { OPTIMIZED_FONT_PROVIDERS } from './utils/constants.js'
import { getFontDefinitionFromNetwork } from './utils/font-utils.js'

const LIB_NAME = 'astro-fonts-next'

const urls: string[] = []
let buildFormat: 'file' | 'directory'

export interface AstroFontsNextOptions {
  url: string | string[]
}

export default (options: AstroFontsNextOptions): AstroIntegration => {
  return {
    name: LIB_NAME,
    hooks: {
      'astro:config:done': ({ config }) => {
        if (!options.url || options.url === '' || options.url.length === 0) {
          throw new Error(`[${LIB_NAME}]: you must set a \`url\` in your config!`)
        }

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

        buildFormat = config.build.format
      },

      // 'astro:server:setup': ({ server }) => {
      //   // eslint-disable-next-line no-console
      //   console.log(server)
      // },

      'astro:build:done': async ({ pages, dir }) => {
        const fontDefinitionPromises = urls.map((url) => getFontDefinitionFromNetwork(url))

        const fontsData = (await Promise.all(fontDefinitionPromises)).map((content, i) => ({
          content,
          url: urls[i],
          preconnect: OPTIMIZED_FONT_PROVIDERS.find((provider) => urls[i]?.startsWith(provider.url))?.preconnect,
        }))

        const promises = pages.map(async ({ pathname }) => {
          let extensionWithPathname = ''

          if (pathname === '') {
            extensionWithPathname = 'index.html'
          } else if (buildFormat === 'directory') {
            extensionWithPathname = join(pathname, 'index.html')
          } else {
            extensionWithPathname = pathname.replace(/\/$/, '') + '.html'
          }

          const filePath = join(dir.pathname, extensionWithPathname)
          const file = await readFile(filePath, 'utf-8')

          const $ = load(file)

          fontsData.forEach(({ content, url, preconnect }) => {
            // Preconnect Link
            if ($(`link[rel="preconnect"][href="${preconnect}"]`).length === 0) {
              $('head').append(`<link rel="preconnect" href="${preconnect}">`)
            }

            // Font CSS
            if ($(`style[data-href="${url}"]`).length === 0) {
              $('head').append(`<style data-href="${url}">${content}</style>`)
            }
          })

          await writeFile(filePath, $.html())
        })

        await Promise.all(promises)
        // eslint-disable-next-line no-console
        console.log(`[${LIB_NAME}]: Font optimization is complete.`)
      },
    },
  }
}
