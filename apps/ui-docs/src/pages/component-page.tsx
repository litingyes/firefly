import { Badge } from '@firefly/ui/components/ui/badge'
import { Link, useParams } from 'react-router-dom'

import { ComponentNotFound } from '@/components/component-not-found'
import { ComponentPageNav, type ComponentPageSection } from '@/components/component-page-nav'
import { DocsCopyButton } from '@/components/docs-copy-button'
import { docsType } from '@/lib/docs-type'
import { findComponent } from '@/registry'
import { getComponentMeta } from '@/registry/component-meta'
import type { ComponentCategory } from '@/registry/types'

function sectionId(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-')
}

export function ComponentPage() {
  const { category, name } = useParams<{ category: ComponentCategory; name: string }>()

  if (!category || !name || (category !== 'ui' && category !== 'ai-elements')) {
    return <ComponentNotFound name={name} />
  }

  const entry = findComponent(category, name)

  if (!entry) {
    return <ComponentNotFound name={name} />
  }

  const meta = getComponentMeta(entry)
  const importPath = `@firefly/ui/components/${category}/${entry.name}`

  const sections: ComponentPageSection[] = [
    { id: sectionId('Usage'), label: 'Usage' },
    { id: sectionId('Props'), label: 'Props' },
    { id: sectionId('Accessibility'), label: 'Accessibility' },
    ...(meta.related && meta.related.length > 0
      ? [{ id: sectionId('Related'), label: 'Related' }]
      : []),
    { id: sectionId('Examples'), label: 'Examples' },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_8.5rem] xl:gap-10">
        <div className="min-w-0 space-y-10">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className={docsType.pageTitle}>{entry.title}</h1>
              <Badge variant={category === 'ai-elements' ? 'default' : 'secondary'}>
                {category === 'ui' ? 'UI' : 'AI Element'}
              </Badge>
            </div>
            <p className={`${docsType.lead} text-muted-foreground`}>{meta.description}</p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <code className={`${docsType.codeBlock} min-w-0 flex-1 truncate`}>{importPath}</code>
              <DocsCopyButton
                label={`Copy import for ${entry.title}`}
                value={`import { ${entry.title.replace(/\s+/g, '')} } from '${importPath}'`}
              />
            </div>
          </header>

          <section className="docs-section-anchor space-y-3" id={sectionId('Usage')}>
            <h2 className={docsType.sectionTitle}>Usage</h2>
            <pre
              className={`${docsType.codeBlock} overflow-x-auto rounded-lg border border-border bg-muted/40 p-4`}
            >
              {meta.usage}
            </pre>
          </section>

          <section className="docs-section-anchor space-y-3" id={sectionId('Props')}>
            <h2 className={docsType.sectionTitle}>Props</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className={`${docsType.table} w-full min-w-lg text-left`}>
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className={`${docsType.sectionTitle} px-4 py-2`} scope="col">
                      Name
                    </th>
                    <th className={`${docsType.sectionTitle} px-4 py-2`} scope="col">
                      Type
                    </th>
                    <th className={`${docsType.sectionTitle} px-4 py-2`} scope="col">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meta.props.map((prop) => (
                    <tr key={prop.name} className="border-b border-border last:border-0">
                      <td className={`${docsType.tableName} px-4 py-2`}>{prop.name}</td>
                      <td className={`${docsType.tableType} px-4 py-2 text-muted-foreground`}>
                        {prop.type}
                      </td>
                      <td className={`${docsType.meta} px-4 py-2 text-muted-foreground`}>
                        {prop.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="docs-section-anchor space-y-3" id={sectionId('Accessibility')}>
            <h2 className={docsType.sectionTitle}>Accessibility</h2>
            <ul className={`${docsType.body} list-disc space-y-2 pl-5 text-muted-foreground`}>
              {meta.a11y.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          {meta.related && meta.related.length > 0 ? (
            <section className="docs-section-anchor space-y-3" id={sectionId('Related')}>
              <h2 className={docsType.sectionTitle}>Related</h2>
              <div className="flex flex-wrap gap-2">
                {meta.related.map((related) => (
                  <Link
                    key={`${related.category}-${related.name}`}
                    className={`${docsType.meta} inline-flex h-8 items-center rounded-lg border border-border px-3 transition-colors hover:border-primary/35 hover:bg-primary/5 hover:text-primary`}
                    to={`/components/${related.category}/${related.name}`}
                  >
                    {related.title}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="docs-section-anchor space-y-3" id={sectionId('Examples')}>
            <h2 className={docsType.sectionTitle}>Examples</h2>
            {entry.demo?.()}
          </section>
        </div>

        <ComponentPageNav sections={sections} />
      </div>
    </div>
  )
}
