declare const atob: any
declare const Blob: any
declare const URL: any
declare const Worker: any

function workerHelper(url: string) {
  if (url.startsWith('data:')) {
    const binaryString = atob(url.replace(/^data:.*?base64,/, ''))
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const blob = new Blob([bytes], { type: 'application/javascript' })
    url = URL.createObjectURL(blob)
  }
  return new Worker(url)
}

export const id = '/vite/worker-helper'
export const code = workerHelper.toString()
