import { cn } from '@firefly/ui'
import type { ComponentProps } from 'react'

import type { WebSearchProviderDefinition } from '@/lib/web-search'

interface WebSearchProviderLogoProps extends Omit<ComponentProps<'div'>, 'children'> {
  provider: WebSearchProviderDefinition['logo']
}

export function WebSearchProviderLogo({
  provider,
  className,
  ...props
}: WebSearchProviderLogoProps) {
  if (provider === 'brave') {
    return (
      <div
        {...props}
        aria-hidden
        className={cn(
          'flex size-full items-center justify-center rounded-[inherit] bg-[#381380] text-[10px] font-bold text-white',
          className,
        )}
      >
        B
      </div>
    )
  }

  if (provider === 'exa') {
    return (
      <div
        {...props}
        aria-hidden
        className={cn(
          'flex size-full items-center justify-center rounded-[inherit] bg-[#111827] text-[10px] font-bold text-white',
          className,
        )}
      >
        E
      </div>
    )
  }

  if (provider === 'tavily') {
    return (
      <div
        {...props}
        aria-hidden
        className={cn(
          'flex size-full items-center justify-center rounded-[inherit] bg-[#0f766e] text-[10px] font-bold text-white',
          className,
        )}
      >
        T
      </div>
    )
  }

  return null
}
