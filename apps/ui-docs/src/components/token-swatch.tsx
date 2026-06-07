import { Button } from '@firefly/ui/components/ui/button'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useCallback, useState } from 'react'

interface TokenSwatchProps {
  name: string
  value: string
  foreground?: string
  contrastRatio?: number | null
}

export function TokenSwatch({ name, value, foreground, contrastRatio }: TokenSwatchProps) {
  const [copied, setCopied] = useState(false)

  const copyValue = useCallback(async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }, [value])

  const meetsAa = contrastRatio !== null && contrastRatio !== undefined && contrastRatio >= 4.5

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div
        className="flex h-16 items-end p-2"
        style={{
          backgroundColor: value,
          color: foreground ?? 'var(--foreground)',
        }}
      >
        <span className="truncate font-mono text-xs opacity-80">{value}</span>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border bg-card px-3 py-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-xs">{name}</p>
          {contrastRatio !== null && contrastRatio !== undefined ? (
            <p className={meetsAa ? 'text-muted-foreground text-xs' : 'text-destructive text-xs'}>
              {contrastRatio.toFixed(2)}:1 {meetsAa ? 'AA' : 'below AA'}
            </p>
          ) : null}
        </div>
        <Button
          aria-label={`Copy ${name}`}
          onClick={() => void copyValue()}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        </Button>
      </div>
    </div>
  )
}
