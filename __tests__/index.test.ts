import { readFile } from 'fs/promises'
import { globby } from 'globby'
import { join } from 'path/posix'
import { describe, expect, test } from 'vitest'

const getDistDir = (fixturePath: string) =>
  globby(join('__tests__/fixtures', fixturePath), {
    expandDirectories: { extensions: ['html'] },
  })
const getHtmlData = async (fixturePath: string) => {
  const distDir = await getDistDir(fixturePath)
  return await Promise.all(
    distDir.map(async (dir) => ({
      path: dir,
      content: await readFile(dir, 'utf-8'),
    }))
  )
}

describe('Build-time behavior', () => {
  test('Set a single value for url', async () => {
    const htmlData = await getHtmlData('single')
    expect(htmlData).toMatchSnapshot()
  })
  test('Set single values for url in file type', async () => {
    const htmlData = await getHtmlData('single-file')
    expect(htmlData).toMatchSnapshot()
  })
  test('Set multiple values for url', async () => {
    const htmlData = await getHtmlData('multiple')
    expect(htmlData).toMatchSnapshot()
  })
  test('Set multiple values for url in file type', async () => {
    const htmlData = await getHtmlData('multiple-file')
    expect(htmlData).toMatchSnapshot()
  })
})
