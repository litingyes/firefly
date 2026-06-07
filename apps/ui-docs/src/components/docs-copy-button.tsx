import { Button } from '@firefly/ui/components/ui/button'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useCallback, useState } from 'react'

interface DocsCopyButtonProps {
  value: string
  label: string
}

export function DocsCopyButton({ value, label }: DocsCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }, [value])

  return (
    <div className="relative shrink-0">
      <span aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
      <Button
        aria-label={copied ? `${label} copied` : label}
        onClick={() => void copy()}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        {copied ? (
          <CheckIcon className="docs-copy-pop size-3.5 text-primary" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </Button>
    </div>
  )
}
