import { msg } from './workerImport'

self.onmessage = async ({ data }) => {
  if (data !== 'test') return

  Promise.all([
    self.postMessage({
      key: 'response',
      value: msg
    }),
    self.postMessage({
      key: 'protocol',
      value: self.location.protocol
    })
  ])
}
