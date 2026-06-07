import { useEffect } from 'react'

const SESSION_KEY = 'firefly-docs-delight'

export function useDocsDelight() {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return
    sessionStorage.setItem(SESSION_KEY, '1')

    console.info(
      '%cFirefly UI%c  Pure AI. Every scene, a glow.\n%cTip:%c  Press ⌘K to search components.',
      'color: oklch(0.51 0.165 192); font-weight: 600',
      'color: inherit',
      'color: oklch(0.51 0.165 192); font-weight: 600',
      'color: inherit',
    )
  }, [])
}
