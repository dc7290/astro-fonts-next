import urls from './urls.json'
import { OPTIMIZED_FONT_PROVIDERS } from './utils/constants.js'

const devScript = () => {
  const fontsData = urls.map((url) => ({
    url,
    preconnect: OPTIMIZED_FONT_PROVIDERS.find((provider) => url?.startsWith(provider.url))?.preconnect,
  }))

  fontsData.forEach(({ url, preconnect }) => {
    const linkElementToPreconnect = document.createElement('link')
    const linkElementToLoadFont = document.createElement('link')

    linkElementToPreconnect.rel = 'preconnect'
    if (preconnect) {
      linkElementToPreconnect.href = preconnect
    }

    linkElementToLoadFont.rel = 'stylesheet'
    linkElementToLoadFont.href = url

    document.head.appendChild(linkElementToPreconnect)
    document.head.appendChild(linkElementToLoadFont)
  })
}

export default devScript
