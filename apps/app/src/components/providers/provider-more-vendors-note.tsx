import { ExternalLinkIcon } from 'lucide-react'

import { AI_SDK_PROVIDERS_URL, FIREFLY_ISSUES_URL } from '@/lib/providers'

export function ProviderMoreVendorsNote() {
  return (
    <p className="text-muted-foreground text-sm leading-relaxed">
      Need another vendor? Check the{' '}
      <a
        className="inline-flex items-center gap-0.5 text-foreground underline underline-offset-4 hover:text-primary"
        href={AI_SDK_PROVIDERS_URL}
        rel="noreferrer"
        target="_blank"
      >
        AI SDK provider list
        <ExternalLinkIcon aria-hidden className="size-3.5" />
      </a>{' '}
      first. If it is already supported there,{' '}
      <a
        className="text-foreground underline underline-offset-4 hover:text-primary"
        href={FIREFLY_ISSUES_URL}
        rel="noreferrer"
        target="_blank"
      >
        open an issue
      </a>{' '}
      to request it in Firefly.
    </p>
  )
}
