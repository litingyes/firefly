import { cn } from '@firefly/ui/lib/utils'

import { docsType } from '@/lib/docs-type'

export type ComponentPageSection = {
  id: string
  label: string
}

interface ComponentPageNavProps {
  sections: ComponentPageSection[]
}

export function ComponentPageNav({ sections }: ComponentPageNavProps) {
  if (sections.length < 4) return null

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-6 space-y-1 border-l border-border pl-3">
        <p className={`${docsType.meta} mb-2 text-muted-foreground`}>On this page</p>
        {sections.map((section) => (
          <a
            key={section.id}
            className={cn(
              docsType.meta,
              'block py-0.5 text-muted-foreground transition-colors hover:text-primary',
            )}
            href={`#${section.id}`}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
