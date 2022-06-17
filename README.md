# astro-fonts-next

<div>
<a href="https://www.npmjs.com/package/astro-fonts-next" target="_blank"><img alt="npm" src="https://img.shields.io/npm/v/astro-fonts-next"></a>
<a href="https://npmcharts.com/compare/astro-fonts-next?minimal=true" target="_blank"><img alt="downloads" src="https://img.shields.io/npm/dt/astro-fonts-next"></a>
<a href="https://www.npmjs.com/package/astro-fonts-next" target="__blank"><img alt="License" src="https://img.shields.io/npm/l/astro-fonts-next?label=License"></a>
<a href="https://github.com/dc7290/astro-fonts-next/actions/workflows/node.js.yml" target="_blank"><img alt="Node.js CI" src="https://github.com/dc7290/astro-fonts-next/actions/workflows/node.js.yml/badge.svg"></a>
<a href="https://github.com/dc7290/astro-fonts-next/stargazers" target="_blank"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/dc7290/astro-fonts-next?style=social"></a>
</div>

This integration applies Next.js font optimization solution to Astro.
reference: https://nextjs.org/docs/basic-features/font-optimization

## Installation

```bash
yarn add -D astro-fonts-next
```

## Usage

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import astroFonts from 'astro-fonts-next'

export default defineConfig({
  integrations: [
    astroFonts({ url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' }),
    // astroFonts({ url: 'https://use.typekit.net/~~~~~.css' }),
    // or
    astroFonts({
      url: [
        'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
      ],
    }),
  ],
  experimental: {
    integrations: true,
  },
})
```

## API Reference

### Integration

`import astroFonts from 'astro-fonts-next'`

| key | type                   | required | default | description                                                                                                                                                                                                                                                                                                 |
| --- | ---------------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url | `string` \| `string[]` | true     |         | The actual link to the font provider to be used. You may specify more than one in the array.<br />(e.g.<br />`<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">`<br />→ `https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap`) |

## License

astro-fonts-next is available under the MIT License.
