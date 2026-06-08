import { Loader2Icon } from 'lucide-react'

import { cn } from '#lib/utils'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <output aria-label="Loading" aria-live="polite" className={cn('inline-flex', className)}>
      <Loader2Icon className="size-4 animate-spin" {...props} />
    </output>
  )
}

export { Spinner }
