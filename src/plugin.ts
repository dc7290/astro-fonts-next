import type { HtmlTagDescriptor, Plugin } from 'vite'

import { OPTIMIZED_FONT_PROVIDERS } from './utils/constants'
import { getFontDefinitionFromNetwork } from './utils/font-utils'

interface PluginOptins {
  urls: string[]
  command: 'dev' | 'build'
}

function plugin(options: PluginOptins): Plugin {
  return {
    name: 'astro-fonts-next-vite',
    transformIndexHtml: async () => {
      if (options.command === 'build') {
        const fontDefinitionPromises = options.urls.map((url) => getFontDefinitionFromNetwork(url))

        const tags: HtmlTagDescriptor[] = []
        for (const promiseIndex in fontDefinitionPromises) {
          const css = await fontDefinitionPromises[promiseIndex]
          const url = options.urls[promiseIndex]

          if (css && url) {
            // Font CSS
            tags.push({
              tag: 'style',
              attrs: {
                'data-href': url,
              },
              children: css,
            })
            // Preconnect Link
            tags.push({
              tag: 'link',
              attrs: {
                rel: 'preconnect',
                href: OPTIMIZED_FONT_PROVIDERS.find((provider) => url.startsWith(provider.url))?.preconnect,
              },
            })
          }
        }

        return tags
      } else {
        const tags: HtmlTagDescriptor[] = options.urls.map((url) => ({
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: url,
          },
        }))

        return tags
      }
    },
  }
}

export default plugin
