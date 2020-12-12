import { Plugin } from 'rollup'
import { createFilter, FilterPattern } from '@rollup/pluginutils'
import * as workerHelper from '../utils/workerHelper'
import { injectAssetRe } from './buildPluginAsset'

export interface WorkerBuildPluginOptions {
  include?: FilterPattern
  exclude?: FilterPattern
}

export const createWorkerBuildPlugin = ({
  include,
  exclude
}: WorkerBuildPluginOptions): Plugin => {
  const filter = createFilter(include, exclude)

  return {
    name: 'vite:worker',

    resolveId(id) {
      if (id === workerHelper.id) {
        return id
      }
    },

    load(id) {
      if (id === workerHelper.id) {
        return `export default ${workerHelper.code}`
      }
    },

    transform(code, id) {
      if (!filter(id)) return

      const [url] = injectAssetRe.exec(code) || []

      if (!url) {
        this.error(`Could not transform '${id}' into worker`)
      }

      return `
import initWorker from "${workerHelper.id}"
export default function WrappedWorker() {
  return initWorker(${JSON.stringify(url)})
}
`
    }
  }
}
