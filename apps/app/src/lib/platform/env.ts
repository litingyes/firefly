export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

export function isBrowserDev(): boolean {
  return import.meta.env.DEV && !isTauri()
}
