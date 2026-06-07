import { Button } from '@firefly/ui/components/ui/button'
import { Link } from 'react-router-dom'

import { useOpenDocsSearch } from '@/components/docs-search-context'
import { docsType } from '@/lib/docs-type'

interface ComponentNotFoundProps {
  name?: string
}

export function ComponentNotFound({ name }: ComponentNotFoundProps) {
  const openSearch = useOpenDocsSearch()

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className={docsType.pageTitle}>Component not found</h1>
      <p className={`${docsType.lead} text-muted-foreground`}>
        {name
          ? `"${name}" is not in the docs registry.`
          : 'That path does not match a documented component.'}{' '}
        Search the catalog or jump to a common starting point.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={openSearch} size="sm" type="button">
          Open search
        </Button>
        <Button
          nativeButton={false}
          render={<Link to="/components/ui/button">View Button</Link>}
          size="sm"
          type="button"
          variant="outline"
        />
        <Button
          nativeButton={false}
          render={<Link to="/">Back to overview</Link>}
          size="sm"
          type="button"
          variant="ghost"
        />
      </div>
    </div>
  )
}
