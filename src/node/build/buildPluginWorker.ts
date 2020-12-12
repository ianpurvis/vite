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

      let [url, referenceId] = injectAssetRe.exec(code) || []

      if (!referenceId) {
        this.error(`Could not transform '${id}' into worker`)
      } else {
        url = `import.meta.VITE_INLINABLE_URL_${referenceId}`
      }

      return `
import initWorker from "${workerHelper.id}"
export default function WrappedWorker() {
  return initWorker(${url})
}
`
    }
  }
}
