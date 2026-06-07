import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@firefly/ui/components/ui/command'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AI_ELEMENT_GROUPS } from '@/registry/ai-element-groups'
import { aiElementRegistry } from '@/registry/ai-elements'
import type { ComponentDemoEntry } from '@/registry/types'
import { uiRegistry } from '@/registry/ui'
import { UI_COMPONENT_GROUPS } from '@/registry/ui-component-groups'

interface DocsCommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function toPath(entry: ComponentDemoEntry) {
  return `/components/${entry.category}/${entry.name}`
}

export function DocsCommandPalette({ open, onOpenChange }: DocsCommandPaletteProps) {
  const navigate = useNavigate()

  const selectEntry = (entry: ComponentDemoEntry) => {
    onOpenChange(false)
    navigate(toPath(entry))
  }

  return (
    <CommandDialog
      className="docs-command-dialog"
      description="Jump to any UI primitive or AI element"
      onOpenChange={onOpenChange}
      open={open}
      title="Search components"
    >
      <CommandInput placeholder="Try button, message, or theme…" />
      <CommandList>
        <CommandEmpty>No matches. Try a component name or AI group.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem
            onSelect={() => {
              onOpenChange(false)
              navigate('/')
            }}
          >
            Overview
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onOpenChange(false)
              navigate('/theme')
            }}
          >
            Theme
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        {UI_COMPONENT_GROUPS.map((group) => {
          const entries = uiRegistry.filter((entry) => group.items.includes(entry.name))
          if (entries.length === 0) return null

          return (
            <CommandGroup key={group.id} heading={`UI · ${group.label}`}>
              {entries.map((entry) => (
                <CommandItem
                  key={entry.name}
                  onSelect={() => selectEntry(entry)}
                  value={`${entry.title} ${group.label}`}
                >
                  {entry.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )
        })}
        {AI_ELEMENT_GROUPS.map((group) => {
          const entries = aiElementRegistry.filter((entry) => group.items.includes(entry.name))
          if (entries.length === 0) return null

          return (
            <CommandGroup key={group.id} heading={`AI · ${group.label}`}>
              {entries.map((entry) => (
                <CommandItem
                  key={entry.name}
                  onSelect={() => selectEntry(entry)}
                  value={`${entry.title} ${group.label}`}
                >
                  {entry.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )
        })}
      </CommandList>
    </CommandDialog>
  )
}

export function useDocsCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return { open, setOpen }
}
