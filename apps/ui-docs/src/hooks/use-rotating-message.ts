import { useEffect, useState } from 'react'

export function useRotatingMessage(messages: readonly string[], intervalMs = 2200) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (messages.length <= 1) return

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [intervalMs, messages])

  return messages[index] ?? messages[0] ?? ''
}
