import { load } from 'cheerio'
import { readFile } from 'fs/promises'
import { globby } from 'globby'
import { join } from 'path'
import { join as posixJoin } from 'path/posix'
import { describe, expect, test } from 'vitest'

const getDistDir = (fixturePath: string) =>
  globby(posixJoin('__tests__/fixtures', fixturePath), {
    expandDirectories: { extensions: ['html'] },
  })
const getHtmlData = async (fixturePath: string) => {
  const distDir = await getDistDir(fixturePath)
  return await Promise.all(distDir.map((dir) => readFile(join(process.cwd(), dir), 'utf-8')))
}
const getFontElementlengths = async (fixturePath: string, urls: string[]) => {
  const htmlData = await getHtmlData(fixturePath)
  return htmlData
    .map((html) => {
      const $ = load(html)
      return urls.map((url) => ({
        preconnect: $(`link[rel="preconnect"][href="https://fonts.gstatic.com"]`).length,
        font: $(`style[data-href="${url}"]`).length,
      }))
    })
    .flat()
}

describe('Build-time behavior', () => {
  test('Set a single value for url', async () => {
    const urls = ['https://fonts.googleapis.com/css2?family=Roboto:wght@400;700']
    const fontElementlengths = await getFontElementlengths('single', urls)

    fontElementlengths.forEach(({ preconnect, font }) => {
      expect(preconnect).toBe(1)
      expect(font).toBe(1)
    })
  })
  test('Set single values for url in file type', async () => {
    const urls = ['https://fonts.googleapis.com/css2?family=Roboto:wght@400;700']
    const fontElementlengths = await getFontElementlengths('single-file', urls)

    fontElementlengths.forEach(({ preconnect, font }) => {
      expect(preconnect).toBe(1)
      expect(font).toBe(1)
    })
  })
  test('Set multiple values for url', async () => {
    const urls = ['https://fonts.googleapis.com/css2?family=Roboto:wght@400;700']
    const fontElementlengths = await getFontElementlengths('multiple', urls)

    fontElementlengths.forEach(({ preconnect, font }) => {
      expect(preconnect).toBe(1)
      expect(font).toBe(1)
    })
  })
  test('Set multiple values for url in file type', async () => {
    const urls = ['https://fonts.googleapis.com/css2?family=Roboto:wght@400;700']
    const fontElementlengths = await getFontElementlengths('multiple-file', urls)

    fontElementlengths.forEach(({ preconnect, font }) => {
      expect(preconnect).toBe(1)
      expect(font).toBe(1)
    })
  })
})
