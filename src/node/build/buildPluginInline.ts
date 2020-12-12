import mime from 'mime-types'
import { join } from 'path'
import { Plugin } from 'rollup'
import slash from 'slash'

const debug = require('debug')('vite:build:inline')

const buff = (source: string | Uint8Array): Buffer =>
  Buffer.isBuffer(source) ? source : Buffer.from(source)

export interface InlineBuildPluginOptions {
  assetsDir: string
  maxBytes: number
  publicBasePath: string
}

export const createInlineBuildPlugin = ({
  assetsDir,
  maxBytes,
  publicBasePath
}: InlineBuildPluginOptions): Plugin => {
  return {
    name: 'vite:inline',

    generateBundle(_, bundle) {
      const cache = new Map<string, string>()
      const inlinableUrlRe = /import.meta.VITE_INLINABLE_URL_(\w+)/g
      const resolveInlinableUrl = (url: string, referenceId: string) => {
        const fileName = this.getFileName(referenceId)
        const file = bundle[fileName]

        url = slash(join(publicBasePath, assetsDir, fileName))

        if (file.type === 'chunk') {
          // Check invalid use of VITE_INLINABLE_URL_
          debug(`Ignoring chunk ${url}`)
        } else if (cache.has(fileName)) {
          url = cache.get(fileName)!
        } else {
          const content = buff(file.source)
          if (content.length < maxBytes) {
            debug(`${url} -> base64 inlined`)
            const contentType = mime.lookup(fileName)
            url = `data:${contentType};base64,${content.toString('base64')}`
          }
          cache.set(fileName, url)
        }
        return JSON.stringify(url)
      }

      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk') {
          file.code = file.code.replace(inlinableUrlRe, resolveInlinableUrl)
        }
      }

      for (const [fileName, url] of cache) {
        if (url.startsWith('data:')) {
          delete bundle[fileName]
        }
      }
    }
  }
}
