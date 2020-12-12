import assetPath from './asset.txt'
import inlinableAssetPath from './inlinable-asset.txt'
import { fetchAsset } from './fetch-asset'

self.onmessage = async ({ data }) => {
  if (data !== 'test') return

  Promise.all([
    self.postMessage({
      key: 'protocol',
      value: self.location.protocol
    }),
    self.postMessage({
      key: 'inlinableAssetContent',
      value: await fetchAsset(inlinableAssetPath)
    }),
    self.postMessage({
      key: 'assetContent',
      value: await fetchAsset(assetPath)
    })
  ])
}
