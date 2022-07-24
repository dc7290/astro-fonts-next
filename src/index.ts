import type { AstroIntegration } from 'astro'
import { load } from 'cheerio'
import { writeFileSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { OPTIMIZED_FONT_PROVIDERS } from './utils/constants.js'
import { getFontDefinitionFromNetwork } from './utils/font-utils.js'

const LIB_NAME = 'astro-fonts-next'

const urls: string[] = []
let buildFormat: 'file' | 'directory'

export interface AstroFontsNextOptions {
  url: string | string[]
}

const init = (url: AstroFontsNextOptions['url']) => {
  if (!url || url === '' || url.length === 0) {
    throw new Error(`[${LIB_NAME}]: you must set a \`url\` in your config!`)
  }

  if (typeof url === 'string') {
    urls.push(url)
  }
  if (Array.isArray(url)) {
    urls.push(...url)
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
}

export default (options: AstroFontsNextOptions): AstroIntegration => {
  return {
    name: LIB_NAME,
    hooks: {
      'astro:config:setup': ({ command, injectScript }) => {
        init(options.url)

        if (command === 'dev') {
          writeFileSync(join(dirname(fileURLToPath(import.meta.url)), './urls.json'), JSON.stringify(urls))

          injectScript('page', `import devScript from 'astro-fonts-next/dev.js'; devScript()`)
        }
      },

      'astro:config:done': ({ config }) => {
        buildFormat = config.build.format
      },

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
          } else if (pathname === '404/') {
            extensionWithPathname = '404.html'
          } else if (buildFormat === 'directory') {
            extensionWithPathname = join(pathname, 'index.html')
          } else {
            extensionWithPathname = pathname.replace(/\/$/, '') + '.html'
          }

          const filePath = join(fileURLToPath(dir), extensionWithPathname)
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
