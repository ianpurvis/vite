import { msg } from './workerImport'

self.onmessage = ({ data }) => {
  if (data === 'test') {
    self.postMessage({ key: 'response', value: msg })
  }
}
