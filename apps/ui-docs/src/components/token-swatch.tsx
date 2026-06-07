import { DocsCopyButton } from '@/components/docs-copy-button'
import { docsType } from '@/lib/docs-type'

interface TokenSwatchProps {
  name: string
  value: string
  swatchBackground: string
  swatchForeground?: string | null
  contrastRatio?: number | null
}

export function TokenSwatch({
  name,
  value,
  swatchBackground,
  swatchForeground,
  contrastRatio,
}: TokenSwatchProps) {
  const meetsAa = contrastRatio !== null && contrastRatio !== undefined && contrastRatio >= 4.5

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div
        className="flex h-16 items-end p-2"
        style={{
          backgroundColor: swatchBackground,
          color: swatchForeground ?? undefined,
        }}
      >
        <span className={`${docsType.codeBlock} truncate opacity-90`}>{value}</span>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border bg-card px-3 py-2">
        <div className="min-w-0">
          <p className={`${docsType.tableName} truncate`}>{name}</p>
          {contrastRatio !== null && contrastRatio !== undefined ? (
            <p
              className={
                meetsAa
                  ? `${docsType.meta} text-muted-foreground`
                  : `${docsType.meta} text-destructive`
              }
            >
              {contrastRatio.toFixed(2)}:1 {meetsAa ? 'AA' : 'below AA'}
            </p>
          ) : null}
        </div>
        <DocsCopyButton label={`Copy ${name}`} value={value} />
      </div>
    </div>
  )
}
