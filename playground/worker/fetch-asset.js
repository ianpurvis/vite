export async function fetchAsset(path) {
  const url = new URL(path, origin)
  const response = await fetch(url)
  const { ok, status, statusText } = response
  return ok ? response.text() : `${status}: ${statusText}`
}
