import { fetch as tauriFetch } from '@tauri-apps/plugin-http'

import { isTauri } from '@/lib/tauri-env'

export function getAppFetch(): typeof fetch {
  if (isTauri()) {
    return tauriFetch as typeof fetch
  }
  return globalThis.fetch.bind(globalThis)
}
